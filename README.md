# OpenClaw Agents Control Center

A web dashboard for managing, monitoring, and orchestrating multiple OpenClaw agent instances.

## Features

- **Agent Management**: Register, monitor, and control multiple agent instances
- **Session Tracking**: View active sessions, message history, and agent outputs
- **WebSocket Gateway**: Real-time communication with distributed agents
- **Multi-Tenant**: Organizations, teams, and role-based access
- **Task Queue**: Distribute work to agents with BullMQ
- **Observability**: Logs, metrics, and agent health monitoring

## Quick Start

```bash
# Install dependencies
npm install

# Setup environment
cp .env.example .env
# Edit .env with your database and Redis URLs

# Run database migrations
npx prisma migrate dev

# Start development server
npm run dev
```

## Deployment

### Railway (Recommended)

```bash
# Login and init
railway login
railway init
railway up
```

## Architecture

- **Web UI**: Next.js 14 + Socket.io
- **Database**: PostgreSQL
- **Queue**: Redis + BullMQ
- **WebSocket**: Real-time agent communication

## Documentation

See the [skill documentation](/data/workspace/skills/openclaw-control-center/) for full details.
