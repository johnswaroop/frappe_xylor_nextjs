# Documentation Index

This folder contains comprehensive documentation for the AI Assistant ERPNext integration project.

## 📚 Documentation Files

### Core Implementation

- **[ERPNext Integration Implementation Guide](./erpnext-integration.md)** - Complete implementation documentation covering architecture, components, data flow, and integration patterns
- **[Quick Start Guide](./quick-start.md)** - Developer quick reference for using the ERPNext integration hooks and patterns

### API Reference

- **[Frappe API Documentation](./api.frappe.md)** - Comprehensive API documentation for Frappe/ERPNext integration with Next.js, including authentication, real-time features, and AI integration

## 🏗️ Architecture Overview

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Next.js App   │    │  Nginx Proxy    │    │    ERPNext      │
│  (localhost:3000)│◄──►│                 │◄──►│ (localhost:8000)│
│   /xylor-ai/    │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Data Integration Layer                        │
├─────────────────────────────────────────────────────────────────┤
│ ERPNext API ──► Frappe Client ──► Data Transforms ──► React Hooks │
│                      │                    │              │      │
│                 Proxy Layer         Type Safety      UI State    │
└─────────────────────────────────────────────────────────────────┘
```

## 🚀 Getting Started

1. **New to the project?** Start with the [Quick Start Guide](./quick-start.md)
2. **Need implementation details?** See the [ERPNext Integration Guide](./erpnext-integration.md)
3. **Working with APIs?** Reference the [Frappe API Documentation](./api.frappe.md)

## 📋 Implementation Status

### ✅ Completed Components

- **Frappe Client** (`xylor/lib/frappe-client.ts`) - HTTP client for ERPNext API
- **Type Definitions** (`xylor/lib/types/erpnext.ts`) - TypeScript interfaces for all doctypes
- **API Proxy** (`xylor/app/api/frappe/[...path]/route.ts`) - Next.js API routes for CORS handling
- **Data Transformations** (`xylor/lib/data-transforms.ts`) - ERPNext to UI data conversion
- **React Hooks** (`xylor/hooks/useERPNextData.ts`) - Data fetching hooks with loading/error states

### 🔄 Integration Pending

- **AI Assistant Component** - Replace mock data with ERPNext hooks
- **Authentication Integration** - User session management
- **Real-time Features** - WebSocket integration for live updates

## 🎯 Key Features

- **Type-Safe Integration**: Full TypeScript support for all ERPNext doctypes
- **Proxy Layer**: Next.js API routes handle CORS and authentication
- **Data Transformation**: Converts ERPNext data to UI-friendly formats
- **React Hooks**: Custom hooks with loading states and error handling
- **Search Functionality**: Cross-doctype search with debouncing
- **Mock Data Compatibility**: Seamless transition from mock to real data

## 🔧 Development Workflow

1. **Data Layer**: Use React hooks for data fetching
2. **Type Safety**: Leverage TypeScript interfaces for all data
3. **Error Handling**: Implement proper loading and error states
4. **Performance**: Use project-specific hooks and debouncing
5. **Testing**: Maintain compatibility with existing mock data structure

## 📖 Additional Resources

- **Project Requirements**: See PRD documentation for feature specifications
- **API Endpoints**: ERPNext REST API documentation
- **Component Library**: UI component documentation and examples
- **Deployment**: Production deployment and configuration guides

## 🤝 Contributing

When adding new documentation:

1. Follow the established structure and formatting
2. Include code examples and usage patterns
3. Update this README index
4. Cross-reference related documentation files
