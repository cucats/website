import { browser } from "$app/environment";

class SearchState {
  active = $state(false);
  query = $state("");
  ready = $state(false);

  #recentKey = "cucats:recent-searches";

  get recent(): string[] {
    if (!browser) return [];
    try {
      return JSON.parse(localStorage.getItem(this.#recentKey) ?? "[]");
    } catch {
      return [];
    }
  }

  set recent(value: string[]) {
    if (!browser) return;
    localStorage.setItem(this.#recentKey, JSON.stringify(value.slice(0, 5)));
  }

  addRecent(href: string) {
    this.recent = [href, ...this.recent.filter((x) => x !== href)];
  }

  removeRecent(href: string) {
    this.recent = this.recent.filter((x) => x !== href);
  }

  open() {
    this.active = true;
  }

  close() {
    this.active = false;
    this.query = "";
  }

  toggle() {
    if (this.active) {
      this.close();
    } else {
      this.open();
    }
  }
}

export const searchState = new SearchState();
