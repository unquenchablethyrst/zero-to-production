export function getEnvVariableOrWarn(envVariable: string): string {
  const env: string | undefined = process.env[envVariable];
  if (!env) {
    console.error(`Warning: ${envVariable} environment variable is not set`);
  }
  return env as string;
}

export function envToNumber(
  env: string | undefined,
  defaultNumber: number
): number {
  return env && !Number.isNaN(parseInt(env, 10))
    ? parseInt(env, 10)
    : defaultNumber;
}