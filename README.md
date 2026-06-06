# 🎯 Graphene Terminal 🎯
A high-performance, next-generation digital asset trading terminal built with React Native's New Architecture and a highly concurrent Go backend. Graphene Terminal is engineered for sub-millisecond real-time market data streaming, fluid 60fps UI performance under high-frequency state propagation, and bulletproof offline-first data persistence.

### TestFlight URL
https://testflight.apple.com/join/uD7vPp21

## Features

### Live Order Book & Ticker Streaming
Real-time, ultra-low-latency market data processing utilizing persistent secure WebSockets.

### Advanced Trading Portal
Instant order execution pathways featuring live asset price tracking and precise micro-frontend synchronization.

### Global State Architecture
Clean, decoupled state management powered by Zustand, decoupling network payloads from the rendering pipeline.

### Fluid Architecture Navigation 
Seamless layout transitions designed to sustain high rendering throughput across intensive data dashboards.

## Core Architecture

### 1. React Native New Architecture (Fabric & JSI)
The rendering core drops the legacy asynchronous JSON bridge entirely, utilizing the New Architecture to achieve desktop-grade execution on mobile hardware:

JavaScript Interface (JSI): Synchronous C++ method invocation directly from the JavaScript runtime. Eliminates serialization overhead, allowing JavaScript to hold direct references to host C++ objects.

Fabric Renderer: Utilized across core high-frequency views like TerminalScreen and TradingScreen. Fabric allows for synchronous, thread-safe UI updates, meaning incoming order book deltas mutate the native view hierarchy instantly without asynchronous layout jumps or frame drops.

### 2. TurboModules (Native Hardware Integration)
Low-level OS operations bypass the legacy bridge via custom C++ TurboModules, loaded lazily on demand to optimize application start times:

Hardware Telemetry: Direct native hardware access APIs (e.g., getBatteryLevel, getTemperature) to monitor device thermal throttling during intensive data streaming.

Zero-Bridge Overheads: Native invocations behave exactly like standard JavaScript functions, executing synchronously over JSI.

### 3. Reactive Local Storage (WatermelonDB)
To manage historical market charts and offline states without blocking the main UI thread, Graphene Terminal implements WatermelonDB:

True Laziness: Data is only loaded into memory when explicitly requested by a UI component, preventing large local databases from degrading runtime performance.

Thread Batching: High-frequency transaction logs and historical ticker states are batched in background threads before being committed via single-pass SQL statements to optimize disk I/O.

### 4. High-Performance Motion (React Native Reanimated)
UI interactions use React Native Reanimated to keep interface animations running smoothly at a locked 60fps:

Worklet Thread Execution: All layout animations, bento-grid expansions, and flashing order book deltas run entirely on the UI thread via specialized JavaScript "worklets."

Advanced Memoization: Value changes are heavily memoized using custom hook dependencies, preventing costly React re-renders when data points alter at millisecond frequencies.

### 5. Production Telemetry & Performance Tracking
The application embeds a custom diagnostics harness to constantly measure execution metrics in production:

Custom FPS Tracker Hook: A real-time telemetry hook monitoring the hardware UI/JS frame rates under heavy state loads, enabling automated degradation safety paths if performance drops below optimal thresholds.

## Backend Infrastructure
The application connects directly to an enterprise-grade, high-concurrency architecture deployed on Fly.io using a PostgreSQL database node:

### Go Execution Engine: 
The backend is driven by an ultra-fast, concurrent engine optimized for high-throughput WebSockets and rapid HTTP POST order dispatching. The complete implementation is publicly reviewable in the accompanying GO-API repository.

### Concurrency Models: 
Built around pure Go primitives, using goroutines for non-blocking network socket monitoring and optimized shared memory synchronization for real-time asset pricing matrices.

### CI/CD Pipeline Configuration
The release workflow is entirely automated using Codemagic, guaranteeing continuous integration and clean deployment directly to Apple TestFlight.


