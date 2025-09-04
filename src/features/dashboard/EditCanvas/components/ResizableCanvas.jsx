import React, { useState, useRef, useEffect } from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import { Maximize2, Minimize2 } from 'lucide-react';

const ResizableCanvas = ({ 
  children, 
  minWidth = 400, 
  minHeight = 300, 
  initialWidth = 800, 
  initialHeight = 600,
  onResize = null,
  title = "Canvas"
}) => {
  const [dimensions, setDimensions] = useState({ 
    width: initialWidth, 
    height: initialHeight 
  });
  const [isResizing, setIsResizing] = useState(false);
  const [resizeDirection, setResizeDirection] = useState(null);
  const [isMaximized, setIsMaximized] = useState(false);
  const canvasRef = useRef(null);
  const startPosRef = useRef({ x: 0, y: 0 });
  const startDimensionsRef = useRef({ width: 0, height: 0 });

  const handleMouseDown = (e, direction) => {
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);
    setResizeDirection(direction);
    startPosRef.current = { x: e.clientX, y: e.clientY };
    startDimensionsRef.current = { ...dimensions };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleMouseMove = (e) => {
    if (!isResizing) return;

    const deltaX = e.clientX - startPosRef.current.x;
    const deltaY = e.clientY - startPosRef.current.y;

    let newWidth = startDimensionsRef.current.width;
    let newHeight = startDimensionsRef.current.height;

    switch (resizeDirection) {
      case 'e':
        newWidth = Math.max(minWidth, startDimensionsRef.current.width + deltaX);
        break;
      case 's':
        newHeight = Math.max(minHeight, startDimensionsRef.current.height + deltaY);
        break;
      case 'se':
        newWidth = Math.max(minWidth, startDimensionsRef.current.width + deltaX);
        newHeight = Math.max(minHeight, startDimensionsRef.current.height + deltaY);
        break;
      case 'w':
        newWidth = Math.max(minWidth, startDimensionsRef.current.width - deltaX);
        break;
      case 'n':
        newHeight = Math.max(minHeight, startDimensionsRef.current.height - deltaY);
        break;
      case 'nw':
        newWidth = Math.max(minWidth, startDimensionsRef.current.width - deltaX);
        newHeight = Math.max(minHeight, startDimensionsRef.current.height - deltaY);
        break;
      case 'ne':
        newWidth = Math.max(minWidth, startDimensionsRef.current.width + deltaX);
        newHeight = Math.max(minHeight, startDimensionsRef.current.height - deltaY);
        break;
      case 'sw':
        newWidth = Math.max(minWidth, startDimensionsRef.current.width - deltaX);
        newHeight = Math.max(minHeight, startDimensionsRef.current.height + deltaY);
        break;
      default:
        break;
    }

    const newDimensions = { width: newWidth, height: newHeight };
    setDimensions(newDimensions);
    
    if (onResize) {
      onResize(newDimensions);
    }
  };

  const handleMouseUp = () => {
    setIsResizing(false);
    setResizeDirection(null);
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  };

  const toggleMaximize = () => {
    setIsMaximized(!isMaximized);
  };

  const resizeHandleStyle = (direction) => ({
    position: 'absolute',
    backgroundColor: '#4a7bcb',
    zIndex: 1000,
    cursor: getCursor(direction),
    ...getHandlePosition(direction),
    '&:hover': {
      backgroundColor: '#3a5b9a',
    },
    transition: 'background-color 0.2s ease',
  });

  const getCursor = (direction) => {
    switch (direction) {
      case 'e':
      case 'w':
        return 'ew-resize';
      case 'n':
      case 's':
        return 'ns-resize';
      case 'se':
      case 'nw':
        return 'nwse-resize';
      case 'ne':
      case 'sw':
        return 'nesw-resize';
      default:
        return 'default';
    }
  };

  const getHandlePosition = (direction) => {
    const handleSize = 8;
    switch (direction) {
      case 'e':
        return { 
          right: -handleSize/2, 
          top: '50%', 
          width: handleSize, 
          height: 20, 
          transform: 'translateY(-50%)' 
        };
      case 's':
        return { 
          bottom: -handleSize/2, 
          left: '50%', 
          width: 20, 
          height: handleSize, 
          transform: 'translateX(-50%)' 
        };
      case 'se':
        return { 
          right: -handleSize/2, 
          bottom: -handleSize/2, 
          width: handleSize, 
          height: handleSize 
        };
      case 'w':
        return { 
          left: -handleSize/2, 
          top: '50%', 
          width: handleSize, 
          height: 20, 
          transform: 'translateY(-50%)' 
        };
      case 'n':
        return { 
          top: -handleSize/2, 
          left: '50%', 
          width: 20, 
          height: handleSize, 
          transform: 'translateX(-50%)' 
        };
      case 'nw':
        return { 
          left: -handleSize/2, 
          top: -handleSize/2, 
          width: handleSize, 
          height: handleSize 
        };
      case 'ne':
        return { 
          right: -handleSize/2, 
          top: -handleSize/2, 
          width: handleSize, 
          height: handleSize 
        };
      case 'sw':
        return { 
          left: -handleSize/2, 
          bottom: -handleSize/2, 
          width: handleSize, 
          height: handleSize 
        };
      default:
        return {};
    }
  };

  // Cleanup event listeners on unmount
  useEffect(() => {
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  return (
    <Box
      ref={canvasRef}
      sx={{
        position: 'relative',
        width: isMaximized ? '100vw' : dimensions.width,
        height: isMaximized ? '100vh' : dimensions.height,
        border: '2px solid #4a7bcb',
        borderRadius: '8px',
        backgroundColor: '#F3F7F6',
        overflow: 'hidden',
        boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
        transition: isResizing ? 'none' : 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        display: 'flex',
        flexDirection: 'column',
        backdropFilter: 'blur(10px)',
        borderColor: isMaximized ? '#2d5aa0' : '#4a7bcb',
      }}
    >
      {/* Title Bar */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '8px 16px',
          backgroundColor: '#4a7bcb',
          color: 'white',
          borderTopLeftRadius: '6px',
          borderTopRightRadius: '6px',
          cursor: 'move',
          userSelect: 'none',
        }}
      >
        <Typography
          variant="subtitle2"
          sx={{
            fontWeight: 600,
            fontSize: '14px',
            letterSpacing: '0.5px',
          }}
        >
          {title}
        </Typography>
        <IconButton
          size="small"
          onClick={toggleMaximize}
          sx={{
            color: 'white',
            '&:hover': {
              backgroundColor: 'rgba(255,255,255,0.1)',
            },
          }}
        >
          {isMaximized ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
        </IconButton>
      </Box>

      {/* Resize handles - only show when not maximized */}
      {!isMaximized && (
        <>
          <Box
            sx={resizeHandleStyle('e')}
            onMouseDown={(e) => handleMouseDown(e, 'e')}
          />
          <Box
            sx={resizeHandleStyle('s')}
            onMouseDown={(e) => handleMouseDown(e, 's')}
          />
          <Box
            sx={resizeHandleStyle('se')}
            onMouseDown={(e) => handleMouseDown(e, 'se')}
          />
          <Box
            sx={resizeHandleStyle('w')}
            onMouseDown={(e) => handleMouseDown(e, 'w')}
          />
          <Box
            sx={resizeHandleStyle('n')}
            onMouseDown={(e) => handleMouseDown(e, 'n')}
          />
          <Box
            sx={resizeHandleStyle('nw')}
            onMouseDown={(e) => handleMouseDown(e, 'nw')}
          />
          <Box
            sx={resizeHandleStyle('ne')}
            onMouseDown={(e) => handleMouseDown(e, 'ne')}
          />
          <Box
            sx={resizeHandleStyle('sw')}
            onMouseDown={(e) => handleMouseDown(e, 'sw')}
          />
        </>
      )}

      {/* Canvas content */}
      <Box sx={{ 
        width: '100%', 
        height: '100%', 
        position: 'relative',
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}>
        {children}
      </Box>

      {/* Size indicator - only show when not maximized */}
      {!isMaximized && (
        <Box
          sx={{
            position: 'absolute',
            bottom: '8px',
            right: '8px',
            backgroundColor: 'rgba(74, 123, 203, 0.9)',
            color: 'white',
            padding: '4px 8px',
            borderRadius: '4px',
            fontSize: '11px',
            fontFamily: 'monospace',
            pointerEvents: 'none',
            zIndex: 1001,
            backdropFilter: 'blur(4px)',
            border: '1px solid rgba(255,255,255,0.2)',
          }}
        >
          {dimensions.width} × {dimensions.height}
        </Box>
      )}
    </Box>
  );
};

export default ResizableCanvas;
