type Kind = "success" | "error";
type Toast = { id: number; message: string; kind: Kind };

class Toasts {
  items = $state<Toast[]>([]);
  private nextId = 1;

  show(message: string, kind: Kind = "success", ms = 2000) {
    const id = this.nextId++;
    this.items.push({ id, message, kind });
    setTimeout(() => {
      const idx = this.items.findIndex((t) => t.id === id);
      if (idx >= 0) this.items.splice(idx, 1);
    }, ms);
  }
}

export const toasts = new Toasts();
