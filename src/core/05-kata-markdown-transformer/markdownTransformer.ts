import { MarkdownLink } from './markdownLink';

export class MarkdownTransformer {
  constructor(readonly markdownText: string) {}

  static create(markdownContent: string) {
    return new MarkdownTransformer(markdownContent);
  }

  transform() {
    const links = this.findAllLinks();
    const linksRecord = this.generateLinksRecord(links);
    const transformedMarkdown = this.replaceLinksByAnchors(linksRecord);
    const footnotes = this.generateFootnotes(linksRecord);
    return this.appendFootnotesToMarkdown(transformedMarkdown, footnotes);
  }

  private findAllLinks() {
    const linkRegex = /\[([^\]]+)\]\(([^\)]+)\)/g;
    const matchesAsList = Array.from(this.markdownText.matchAll(linkRegex));
    const links = matchesAsList.map((match) => MarkdownLink.create(match[1], match[2]));
    return this.uniqueLinks(links);
  }

  private uniqueLinks(links: MarkdownLink[]) {
    return links.filter((link, index) => links.findIndex((l) => l.toEqual(link)) === index);
  }

  private generateLinksRecord(markdownLinks: MarkdownLink[]): Record<string, MarkdownLink> {
    return markdownLinks.reduce(
      (previous, current, index) => ({
        ...previous,
        [`[^anchor${index + 1}]`]: current,
      }),
      {} as Record<string, MarkdownLink>
    );
  }

  private replaceLinksByAnchors(linksRecord: Record<string, MarkdownLink>) {
    return Object.keys(linksRecord).reduce((previousText, key) => {
      return previousText.replaceAll(linksRecord[key].toAnchorFormat(), `${linksRecord[key].text} ${key}`);
    }, this.markdownText);
  }

  private generateFootnotes(linksRecord: Record<string, MarkdownLink>) {
    return Object.keys(linksRecord).map((footnoteKey) => `${footnoteKey}: ${linksRecord[footnoteKey].url}`);
  }

  private appendFootnotesToMarkdown(transformedMarkdown: string, footnotes: string[]) {
    return [transformedMarkdown, ...footnotes].join('\n\n');
  }
}
