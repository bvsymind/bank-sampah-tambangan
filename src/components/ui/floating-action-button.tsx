// Fixed DraggableFloatingActionButton component
function DraggableFloatingActionButton({ 
  onClick, 
  children 
}: { 
  onClick: () => void; 
  children: React.ReactNode; 
}) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [initialMousePos, setInitialMousePos] = useState({ x: 0, y: 0 });
  const [isInitialized, setIsInitialized] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dragThreshold = 8; // Increased threshold for better detection

  useEffect(() => {
    const initPosition = () => {
      const buttonSize = 56;
      const margin = 20;
      
      setPosition({
        x: window.innerWidth - buttonSize - margin,
        y: window.innerHeight - buttonSize - margin - 80
      });
      setIsInitialized(true);
    };

    initPosition();
    window.addEventListener('resize', initPosition);
    
    return () => window.removeEventListener('resize', initPosition);
  }, []);

  const snapToSide = (currentX: number, currentY: number) => {
    const buttonSize = 56;
    const margin = 20;
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    const bottomNavHeight = 80;
    
    const minY = margin;
    const maxY = screenHeight - buttonSize - margin - bottomNavHeight;
    const clampedY = Math.max(minY, Math.min(maxY, currentY));
    
    const centerX = screenWidth / 2;
    const snapToLeft = currentX < centerX;
    
    return {
      x: snapToLeft ? margin : screenWidth - buttonSize - margin,
      y: clampedY
    };
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsDragging(true);
    setInitialMousePos({ x: e.clientX, y: e.clientY });
    setDragStart({ 
      x: e.clientX - position.x, 
      y: e.clientY - position.y 
    });
    
    document.body.style.cursor = 'grabbing';
    document.body.style.userSelect = 'none';
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    
    e.preventDefault();
    
    const newX = e.clientX - dragStart.x;
    const newY = e.clientY - dragStart.y;
    
    setPosition({ x: newX, y: newY });
  };

  const handleMouseUp = (e: MouseEvent) => {
    if (!isDragging) return;
    
    // Calculate total drag distance from initial position
    const totalDistance = Math.sqrt(
      Math.pow(e.clientX - initialMousePos.x, 2) + 
      Math.pow(e.clientY - initialMousePos.y, 2)
    );
    
    console.log('Drag distance:', totalDistance); // Debug log
    
    // Reset styles
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
    
    if (totalDistance < dragThreshold) {
      // Short movement = click
      console.log('Click detected'); // Debug log
      onClick();
    } else {
      // Long movement = drag, snap to side
      console.log('Drag detected, snapping to side'); // Debug log
      const snappedPosition = snapToSide(position.x, position.y);
      setPosition(snappedPosition);
    }
    
    setIsDragging(false);
  };

  // Touch events for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const touch = e.touches[0];
    setIsDragging(true);
    setInitialMousePos({ x: touch.clientX, y: touch.clientY });
    setDragStart({ 
      x: touch.clientX - position.x, 
      y: touch.clientY - position.y 
    });
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    
    const touch = e.touches[0];
    const newX = touch.clientX - dragStart.x;
    const newY = touch.clientY - dragStart.y;
    
    setPosition({ x: newX, y: newY });
  };

  const handleTouchEnd = (e: TouchEvent) => {
    if (!isDragging) return;
    
    const touch = e.changedTouches[0];
    const totalDistance = Math.sqrt(
      Math.pow(touch.clientX - initialMousePos.x, 2) + 
      Math.pow(touch.clientY - initialMousePos.y, 2)
    );
    
    if (totalDistance < dragThreshold) {
      onClick();
    } else {
      const snappedPosition = snapToSide(position.x, position.y);
      setPosition(snappedPosition);
    }
    
    setIsDragging(false);
  };

  // Global event listeners
  useEffect(() => {
    if (isDragging) {
      const handleMouseMoveGlobal = (e: MouseEvent) => handleMouseMove(e);
      const handleMouseUpGlobal = (e: MouseEvent) => handleMouseUp(e);
      const handleTouchMoveGlobal = (e: TouchEvent) => handleTouchMove(e);
      const handleTouchEndGlobal = (e: TouchEvent) => handleTouchEnd(e);

      document.addEventListener('mousemove', handleMouseMoveGlobal);
      document.addEventListener('mouseup', handleMouseUpGlobal);
      document.addEventListener('touchmove', handleTouchMoveGlobal, { passive: false });
      document.addEventListener('touchend', handleTouchEndGlobal);
      
      // Prevent scrolling during drag
      document.body.style.overflow = 'hidden';
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMoveGlobal);
        document.removeEventListener('mouseup', handleMouseUpGlobal);
        document.removeEventListener('touchmove', handleTouchMoveGlobal);
        document.removeEventListener('touchend', handleTouchEndGlobal);
        document.body.style.overflow = '';
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
      };
    }
  }, [isDragging, dragStart, position, initialMousePos]);

  return (
    <button
      ref={buttonRef}
      className={cn(
        "fixed z-50 w-14 h-14 rounded-full",
        "bg-gradient-primary hover:bg-primary-glow shadow-floating",
        "text-white transition-all duration-200",
        "flex items-center justify-center",
        "touch-none select-none",
        isDragging 
          ? "cursor-grabbing scale-110 shadow-2xl" 
          : "cursor-grab hover:scale-105",
        !isInitialized && "opacity-0"
      )}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        transition: isDragging 
          ? 'none' 
          : 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
      }}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      // IMPORTANT: Prevent default onClick behavior
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        // onClick is now handled in mouseUp/touchEnd
      }}
      type="button"
      aria-label="Add new item"
    >
      <span className={cn(
        "transition-transform duration-150",
        isDragging ? "scale-90" : "scale-100"
      )}>
        {children}
      </span>
    </button>
  );
}