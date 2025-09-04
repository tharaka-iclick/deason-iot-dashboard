import React, { useState } from 'react';
import { Box, Typography, Button, Stack, Paper } from '@mui/material';
import ResizableCanvas from './ResizableCanvas';

const ResizableCanvasDemo = () => {
  const [canvas1Dimensions, setCanvas1Dimensions] = useState({ width: 400, height: 300 });
  const [canvas2Dimensions, setCanvas2Dimensions] = useState({ width: 600, height: 400 });
  const [canvas3Dimensions, setCanvas3Dimensions] = useState({ width: 500, height: 350 });

  const handleCanvas1Resize = (newDimensions) => {
    setCanvas1Dimensions(newDimensions);
  };

  const handleCanvas2Resize = (newDimensions) => {
    setCanvas2Dimensions(newDimensions);
  };

  const handleCanvas3Resize = (newDimensions) => {
    setCanvas3Dimensions(newDimensions);
  };

  return (
    <Box sx={{ p: 3, backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      <Typography variant="h4" sx={{ mb: 3, color: '#333', textAlign: 'center' }}>
        ResizableCanvas Component Demo
      </Typography>
      
      <Typography variant="body1" sx={{ mb: 4, textAlign: 'center', color: '#666' }}>
        This demo showcases the ResizableCanvas component with different configurations.
        Try dragging the edges and corners to resize the canvases!
      </Typography>

      <Stack spacing={4} alignItems="center">
        {/* Basic Canvas */}
        <Paper elevation={3} sx={{ p: 3, backgroundColor: 'white', borderRadius: 2 }}>
          <Typography variant="h6" sx={{ mb: 2, color: '#4a7bcb' }}>
            Basic Canvas
          </Typography>
          <Typography variant="body2" sx={{ mb: 2, color: '#666' }}>
            A simple resizable canvas with default settings
          </Typography>
          <ResizableCanvas
            minWidth={300}
            minHeight={200}
            initialWidth={canvas1Dimensions.width}
            initialHeight={canvas1Dimensions.height}
            onResize={handleCanvas1Resize}
            title="Basic Canvas"
          >
            <Box
              sx={{
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#e3f2fd',
                border: '2px dashed #2196f3',
                borderRadius: '4px',
                color: '#1976d2',
                fontSize: '18px',
                fontWeight: 'bold',
              }}
            >
              Drag edges to resize me!
            </Box>
          </ResizableCanvas>
          <Typography variant="caption" sx={{ mt: 1, display: 'block', textAlign: 'center', color: '#999' }}>
            Current size: {canvas1Dimensions.width} × {canvas1Dimensions.height}
          </Typography>
        </Paper>

        {/* Large Canvas */}
        <Paper elevation={3} sx={{ p: 3, backgroundColor: 'white', borderRadius: 2 }}>
          <Typography variant="h6" sx={{ mb: 2, color: '#4a7bcb' }}>
            Large Canvas
          </Typography>
          <Typography variant="body2" sx={{ mb: 2, color: '#666' }}>
            A larger canvas with custom minimum dimensions
          </Typography>
          <ResizableCanvas
            minWidth={500}
            minHeight={300}
            initialWidth={canvas2Dimensions.width}
            initialHeight={canvas2Dimensions.height}
            onResize={handleCanvas2Resize}
            title="Large Canvas"
          >
            <Box
              sx={{
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#f3e5f5',
                border: '2px dashed #9c27b0',
                borderRadius: '4px',
                color: '#7b1fa2',
                fontSize: '20px',
                fontWeight: 'bold',
                textAlign: 'center',
                padding: '20px',
              }}
            >
              <div>
                <div>Large Resizable Canvas</div>
                <div style={{ fontSize: '14px', marginTop: '10px', opacity: 0.7 }}>
                  Try the maximize button!
                </div>
              </div>
            </Box>
          </ResizableCanvas>
          <Typography variant="caption" sx={{ mt: 1, display: 'block', textAlign: 'center', color: '#999' }}>
            Current size: {canvas2Dimensions.width} × {canvas2Dimensions.height}
          </Typography>
        </Paper>

        {/* Custom Canvas */}
        <Paper elevation={3} sx={{ p: 3, backgroundColor: 'white', borderRadius: 2 }}>
          <Typography variant="h6" sx={{ mb: 2, color: '#4a7bcb' }}>
            Custom Canvas
          </Typography>
          <Typography variant="body2" sx={{ mb: 2, color: '#666' }}>
            A canvas with custom styling and content
          </Typography>
          <ResizableCanvas
            minWidth={400}
            minHeight={250}
            initialWidth={canvas3Dimensions.width}
            initialHeight={canvas3Dimensions.height}
            onResize={handleCanvas3Resize}
            title="Custom Canvas"
          >
            <Box
              sx={{
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#e8f5e8',
                border: '2px dashed #4caf50',
                borderRadius: '4px',
                color: '#2e7d32',
                padding: '20px',
                textAlign: 'center',
              }}
            >
              <Typography variant="h6" sx={{ mb: 2, color: '#2e7d32' }}>
                Interactive Content
              </Typography>
              <Typography variant="body2" sx={{ mb: 2, opacity: 0.8 }}>
                This canvas contains rich content that adapts to the canvas size.
              </Typography>
              <Box
                sx={{
                  width: '80%',
                  height: '60px',
                  backgroundColor: '#c8e6c9',
                  border: '1px solid #81c784',
                  borderRadius: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '14px',
                }}
              >
                Content Area
              </Box>
            </Box>
          </ResizableCanvas>
          <Typography variant="caption" sx={{ mt: 1, display: 'block', textAlign: 'center', color: '#999' }}>
            Current size: {canvas3Dimensions.width} × {canvas3Dimensions.height}
          </Typography>
        </Paper>

        {/* Features List */}
        <Paper elevation={3} sx={{ p: 3, backgroundColor: 'white', borderRadius: 2, maxWidth: '800px' }}>
          <Typography variant="h6" sx={{ mb: 2, color: '#4a7bcb' }}>
            Features
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 2 }}>
            <Box>
              <Typography variant="subtitle2" sx={{ color: '#4a7bcb', mb: 1 }}>
                ✨ Resizable from all edges and corners
              </Typography>
              <Typography variant="body2" sx={{ color: '#666', fontSize: '14px' }}>
                Drag any edge or corner to resize the canvas dynamically
              </Typography>
            </Box>
            <Box>
              <Typography variant="subtitle2" sx={{ color: '#4a7bcb', mb: 1 }}>
                🔒 Minimum size constraints
              </Typography>
              <Typography variant="body2" sx={{ color: '#666', fontSize: '14px' }}>
                Set minimum width and height to prevent the canvas from becoming too small
              </Typography>
            </Box>
            <Box>
              <Typography variant="subtitle2" sx={{ color: '#4a7bcb', mb: 1 }}>
                📏 Real-time size display
              </Typography>
              <Typography variant="body2" sx={{ color: '#666', fontSize: '14px' }}>
                Shows current dimensions in real-time as you resize
              </Typography>
            </Box>
            <Box>
              <Typography variant="subtitle2" sx={{ color: '#4a7bcb', mb: 1 }}>
                🚀 Maximize/Minimize
              </Typography>
              <Typography variant="body2" sx={{ color: '#666', fontSize: '14px' }}>
                Toggle between normal and full-screen modes
              </Typography>
            </Box>
            <Box>
              <Typography variant="subtitle2" sx={{ color: '#4a7bcb', mb: 1 }}>
                🎨 Professional styling
              </Typography>
              <Typography variant="body2" sx={{ color: '#666', fontSize: '14px' }}>
                Modern design with smooth animations and hover effects
              </Typography>
            </Box>
            <Box>
              <Typography variant="subtitle2" sx={{ color: '#4a7bcb', mb: 1 }}>
                📱 Responsive design
              </Typography>
              <Typography variant="body2" sx={{ color: '#666', fontSize: '14px' }}>
                Adapts to different screen sizes and content requirements
              </Typography>
            </Box>
          </Box>
        </Paper>

        {/* Usage Instructions */}
        <Paper elevation={3} sx={{ p: 3, backgroundColor: 'white', borderRadius: 2, maxWidth: '800px' }}>
          <Typography variant="h6" sx={{ mb: 2, color: '#4a7bcb' }}>
            How to Use
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 2 }}>
            <Box>
              <Typography variant="subtitle2" sx={{ color: '#4a7bcb', mb: 1 }}>
                Basic Usage
              </Typography>
              <Box
                component="pre"
                sx={{
                  backgroundColor: '#f5f5f5',
                  padding: 2,
                  borderRadius: 1,
                  fontSize: '12px',
                  overflow: 'auto',
                  border: '1px solid #e0e0e0',
                }}
              >
{`<ResizableCanvas
  minWidth={400}
  minHeight={300}
  initialWidth={800}
  initialHeight={600}
  onResize={handleResize}
  title="My Canvas"
>
  {/* Your content here */}
</ResizableCanvas>`}
              </Box>
            </Box>
            <Box>
              <Typography variant="subtitle2" sx={{ color: '#4a7bcb', mb: 1 }}>
                Props
              </Typography>
              <Box sx={{ fontSize: '14px', color: '#666' }}>
                <div><strong>minWidth:</strong> Minimum canvas width</div>
                <div><strong>minHeight:</strong> Minimum canvas height</div>
                <div><strong>initialWidth:</strong> Starting width</div>
                <div><strong>initialHeight:</strong> Starting height</div>
                <div><strong>onResize:</strong> Callback when resized</div>
                <div><strong>title:</strong> Canvas title bar text</div>
              </Box>
            </Box>
          </Box>
        </Paper>
      </Stack>
    </Box>
  );
};

export default ResizableCanvasDemo;
