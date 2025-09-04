# ResizableCanvas Component

A professional resizable canvas component for React applications.

## Features

- Resize from all edges and corners
- Minimum size constraints
- Real-time size display
- Maximize/Minimize functionality
- Professional styling with smooth animations

## Usage

```jsx
import ResizableCanvas from './components/ResizableCanvas';

<ResizableCanvas
  minWidth={400}
  minHeight={300}
  initialWidth={800}
  initialHeight={600}
  onResize={handleResize}
  title="My Canvas"
>
  {/* Your content here */}
</ResizableCanvas>
```

## Props

- `minWidth`: Minimum canvas width
- `minHeight`: Minimum canvas height  
- `initialWidth`: Starting width
- `initialHeight`: Starting height
- `onResize`: Callback when resized
- `title`: Canvas title bar text

## Examples

See `ResizableCanvasDemo.jsx` for comprehensive examples.
