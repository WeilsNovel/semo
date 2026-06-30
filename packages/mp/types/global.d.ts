/**
 * 全局类型声明 - Uni-app 全局对象 / Node env / Vue SFC
 * 约束：所有跨文件全局类型在此声明，禁止散落
 */

/// <reference types="@dcloudio/types" />
/// <reference types="vite/client" />

// process.env 类型补丁（构建期注入）
declare const process: {
  env: {
    NODE_ENV?: 'development' | 'staging' | 'production';
    [key: string]: string | undefined;
  };
};

// JSON 模块声明（pages.json / manifest.json 引用）
declare module '*.json' {
  const value: Record<string, unknown>;
  export default value;
}
