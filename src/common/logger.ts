import { env } from 'node:process'

const jsonSpace = env.BUILD_ENV === 'prod' ? 0 : 2

export class Logger {
  readonly namespace: string

  constructor(namespace: string) {
    const name = namespace.replace(/\.tsx?/, '')
    this.namespace = `cot-perspective:${name}`
  }

  error(message: string, error: unknown): void {
    console.error(this.format({ error, level: 'ERROR', message }))
  }

  format(content: object): string {
    return JSON.stringify({ ...content, namespace: this.namespace }, null, jsonSpace)
  }

  info(message: string, meta?: object): void {
    // eslint-disable-next-line no-console
    console.log(this.format({ level: 'INFO', message, meta }))
  }
}
