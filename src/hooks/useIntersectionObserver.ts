import { useEffect } from "react";

type UseIntersectionObserverProps = {
  targetRef: React.RefObject<HTMLElement>;
  onIntersect: () => void;
  enabled?: boolean; // Optional flag to enable/disable the observer
};

const useIntersectionObserver = ({
  targetRef,
  onIntersect,
  enabled = true,
}: UseIntersectionObserverProps) => {
  useEffect(() => {
    const target = targetRef.current;
    if (!target || !enabled) return;

    // Create the intersection observer
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          onIntersect();
        }
      },
      { threshold: 1.0 }
    );

    // Start observing the target element
    observer.observe(target);

    // Cleanup observer on component unmount or when target changes
    return () => {
      if (target) {
        observer.unobserve(target);
      }
    };
  }, [targetRef, onIntersect, enabled]);
};
export default useIntersectionObserver;
