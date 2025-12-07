export class Label {
  id: string;
  start: number;
  end: number;
  name: string;

  constructor(id: string, start: number, end: number, name: string) {
    this.id = id;
    this.start = start;
    this.end = end;
    this.name = name;
  }
}

export class LabelManager {
  private labels: Label[];

  constructor(initialLabels: Label[] = []) {
    this.labels = initialLabels;
  }

  getLabels(): Label[] {
    return this.labels;
  }

  addLabel(label: Label): void {
    this.labels.push(label);
  }

  removeLabel(id: string): void {
    this.labels = this.labels.filter((l) => l.id !== id);
  }

  updateLabel(id: string, updates: Partial<Omit<Label, "id">>): void {
    const label = this.labels.find((l) => l.id === id);
    if (label) {
      if (updates.start !== undefined) label.start = updates.start;
      if (updates.end !== undefined) label.end = updates.end;
      if (updates.name !== undefined) label.name = updates.name;
    }
  }

  getLabel(id: string): Label | undefined {
    return this.labels.find((l) => l.id === id);
  }
}
