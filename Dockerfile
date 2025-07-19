# Stage 1: Install dependencies
FROM node:alpine AS deps

RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN npm install -g pnpm@latest

RUN pnpm install --frozen-lockfile

# Stage 2: Build the app
FROM node:alpine AS builder

WORKDIR /app

COPY . .

COPY --from=deps /app/node_modules ./node_modules

# 赋予 node_modules/.bin 中可执行文件执行权限，避免权限问题
RUN chmod -R a+x ./node_modules/.bin

RUN npm install -g pnpm@latest

RUN pnpm run build

# Stage 3: Production image
FROM node:alpine AS runner

WORKDIR /app

ENV NODE_ENV=production PORT=3000

RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001

# 复制构建产物及依赖
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/package.json ./package.json

# 如果你用 volume 挂载 public 文件夹，这里就不复制了
# COPY --from=builder --chown=nextjs:nodejs /app/public ./public

USER nextjs

EXPOSE 3000

# 直接使用全局next命令启动，避免npx权限/路径问题
CMD ["next", "start"]
