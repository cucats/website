let count = 0;

export function lockScroll() {
  count++;
  if (count === 1) {
    document.body.style.overflow = "hidden";
  }
  return () => {
    count = Math.max(0, count - 1);
    if (count === 0) {
      document.body.style.overflow = "";
    }
  };
}
