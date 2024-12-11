export class MarkdownLink {
  constructor(
    readonly text: string,
    readonly url: string
  ) {}

  static create(text: string, url: string) {
    return new MarkdownLink(text, url);
  }

  toEqual(aLink: MarkdownLink) {
    return this.text === aLink.text && this.url === aLink.url;
  }

  toAnchorFormat() {
    return `[${this.text}](${this.url})`;
  }
}
