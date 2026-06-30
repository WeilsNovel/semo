/**
 * 食物服务 - 调 AI 运行时识别食物，仅识别不落库
 * 约束：图片本地 URL 转为 base64 data URL 喂给 GLM（GLM 无法访问内网）
 *       AI 调用经 withRetry；解析失败抛 AI_RECOGNIZE_FAILED，调用异常抛 AI_CALL_ERROR
 */
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { readFile } from 'fs/promises';
import { join } from 'path';
import {
  AI_MODEL,
  AI_PROVIDER,
  ERROR_CODE,
  FOOD_CATEGORY,
  MEAL_TYPE,
} from '@semo/shared';
import type {
  FoodRecognizeItem,
  FoodRecognizeResponse,
} from '@semo/shared';
import {
  RECOGNIZE_FOOD_SYSTEM_PROMPT,
  RECOGNIZE_FOOD_USER_PROMPT_TEMPLATE,
  AI_SCENE_PARAMS,
} from '@semo/ai';
import { env } from '../../config';
import { STATIC_CONFIG } from '../../config/constants';
import { callAi, AiRuntimeError } from '../../ai/client';
import { withRetry } from '../../ai/retry';
import type { AiMessage } from '../../types';
import type { RecognizeFoodDto } from './dto/recognize-food.dto';

/** 餐次→中文标签（传给 AI 作分量判断上下文） */
const MEAL_TYPE_LABEL: Record<number, string> = {
  [MEAL_TYPE.BREAKFAST]: '早餐',
  [MEAL_TYPE.LUNCH]: '午餐',
  [MEAL_TYPE.DINNER]: '晚餐',
  [MEAL_TYPE.SNACK]: '加餐',
};

/** 合法的食物分类值集合（用于校验/兜底） */
const VALID_CATEGORY_VALUES = new Set<number>([
  FOOD_CATEGORY.STAPLE,
  FOOD_CATEGORY.MEAT,
  FOOD_CATEGORY.VEGETABLE,
  FOOD_CATEGORY.FRUIT,
  FOOD_CATEGORY.DAIRY,
  FOOD_CATEGORY.BEVERAGE,
  FOOD_CATEGORY.OTHER,
]);

@Injectable()
export class FoodService {
  private readonly logger = new Logger(FoodService.name);

  async recognize(dto: RecognizeFoodDto): Promise<FoodRecognizeResponse> {
    if (!dto.image) {
      throw new BadRequestException({
        code: ERROR_CODE.FOOD_IMAGE_INVALID,
        message: '图片参数为空',
      });
    }
    const imageUrl = await this.resolveImageForGlm(dto.image, dto.imageType);
    const traceId = randomUUID();

    const userPrompt = RECOGNIZE_FOOD_USER_PROMPT_TEMPLATE({
      mealType: dto.mealType ? MEAL_TYPE_LABEL[dto.mealType] : undefined,
    });
    const messages: AiMessage[] = [
      { role: 'system', content: RECOGNIZE_FOOD_SYSTEM_PROMPT },
      {
        role: 'user',
        content: [
          { type: 'text', text: userPrompt },
          { type: 'image_url', image_url: { url: imageUrl } },
        ],
      },
    ];

    const sceneParams = AI_SCENE_PARAMS.food_recognize;
    let content: string;
    try {
      const result = await withRetry(
        () =>
          callAi({
            provider: AI_PROVIDER.ZHIPU,
            model: env.ai.glm.model || AI_MODEL.ZHIPU_GLM4V,
            messages,
            temperature: sceneParams.temperature,
            maxTokens: sceneParams.maxTokens,
            timeout: sceneParams.timeout,
            traceId,
          }),
        sceneParams.retryTimes,
      );
      content = result.content;
    } catch (err) {
      const kind = err instanceof AiRuntimeError ? err.kind : 'call';
      throw this.mapAiError(err, kind);
    }

    return this.parseRecognizeResult(content, traceId);
  }

  /** 把图片解析为 GLM 可消费的形式 */
  private async resolveImageForGlm(
    image: string,
    imageType: 'base64' | 'url',
  ): Promise<string> {
    if (imageType === 'base64') {
      // TODO(技术债): base64 未携带 mime，默认 jpeg；前端约定优先走 url
      return `data:image/jpeg;base64,${image}`;
    }
    // 本地静态 URL：读盘转 base64 data URL（GLM 无法访问内网）
    if (image.startsWith(`${STATIC_CONFIG.urlPrefix}/`)) {
      const relPath = image.slice(STATIC_CONFIG.urlPrefix.length + 1);
      const absPath = join(process.cwd(), STATIC_CONFIG.rootDir, relPath);
      const buf = await readFile(absPath);
      const mime = relPath.toLowerCase().endsWith('.png') ? 'image/png' : 'image/jpeg';
      return `data:${mime};base64,${buf.toString('base64')}`;
    }
    // 外网 URL：原样透传，由 GLM 拉取
    return image;
  }

  /** 解析 AI 返回 JSON → FoodRecognizeResponse */
  private parseRecognizeResult(content: string, traceId: string): FoodRecognizeResponse {
    const cleaned = content.replace(/```json|```/gi, '').trim();
    let parsed: { items?: unknown; totalCalories?: unknown };
    try {
      parsed = JSON.parse(cleaned);
    } catch {
      const match = cleaned.match(/\{[\s\S]*\}/);
      if (!match) {
        throw this.recognizeError('AI 返回内容无法解析为 JSON');
      }
      try {
        parsed = JSON.parse(match[0]);
      } catch {
        throw this.recognizeError('AI 返回 JSON 结构非法');
      }
    }

    const rawItems = Array.isArray(parsed.items) ? parsed.items : [];
    const items: FoodRecognizeItem[] = rawItems.map((raw) => {
      const r = raw as Record<string, unknown>;
      const category = Number(r.category);
      return {
        name: String(r.name ?? ''),
        category: VALID_CATEGORY_VALUES.has(category)
          ? (category as FoodRecognizeItem['category'])
          : FOOD_CATEGORY.OTHER,
        weight: Number(r.weight) || 0,
        calories: Number(r.calories) || 0,
        carbs: r.carbs !== undefined ? Number(r.carbs) || 0 : undefined,
        protein: r.protein !== undefined ? Number(r.protein) || 0 : undefined,
        fat: r.fat !== undefined ? Number(r.fat) || 0 : undefined,
        confidence: this.clamp01(Number(r.confidence)),
      };
    });

    const totalCalories = Number(parsed.totalCalories) || items.reduce((s, i) => s + i.calories, 0);
    return { items, totalCalories, aiTraceId: traceId };
  }

  private clamp01(n: number): number {
    if (Number.isNaN(n)) return 0;
    return Math.min(1, Math.max(0, n));
  }

  private recognizeError(message: string): BadRequestException {
    return new BadRequestException({
      code: ERROR_CODE.AI_RECOGNIZE_FAILED,
      message,
    });
  }

  private mapAiError(err: unknown, kind: 'call' | 'recognize'): BadRequestException {
    const msg = err instanceof Error ? err.message : String(err);
    this.logger.error(`[food] AI error kind=${kind}: ${msg}`);
    const code = kind === 'recognize' ? ERROR_CODE.AI_RECOGNIZE_FAILED : ERROR_CODE.AI_CALL_ERROR;
    return new BadRequestException({ code, message: msg });
  }
}
