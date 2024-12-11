import { MarkdownTransformer } from '../../core/05-kata-markdown-transformer/markdownTransformer';

describe('The Markdown Transformer', () => {
  it('does not transform a given markdown text that does not contain any links', () => {
    const markdownText = 'text without any links';
    const transformedText = MarkdownTransformer.create(markdownText).transform();
    expect(transformedText).toBe(markdownText);
  });

  it('transform a given markdown text that contains one link', () => {
    const markdownText = '[visible text link](url)';
    const transformedText = MarkdownTransformer.create(markdownText).transform();
    expect(transformedText).toBe('visible text link [^anchor1]\n\n[^anchor1]: url');
  });

  it('transform a given markdown text that contains multiple links', () => {
    const markdownText = '[visible text link](url)[other visible text link](other url)';
    const transformedText = MarkdownTransformer.create(markdownText).transform();
    expect(transformedText).toEqual(
      'visible text link [^anchor1]other visible text link [^anchor2]\n\n[^anchor1]: url\n\n[^anchor2]: other url'
    );
  });

  it('transform a given markdown text that contains multiple links and extra content', () => {
    const markdownText = '[visible text link](url) some text [other visible text link](other url)';
    const transformedText = MarkdownTransformer.create(markdownText).transform();
    expect(transformedText).toEqual(
      'visible text link [^anchor1] some text other visible text link [^anchor2]\n\n[^anchor1]: url\n\n[^anchor2]: other url'
    );
  });

  it('transform a given markdown text that contains multiple links avoiding duplication', () => {
    const markdownText = '[visible text link](url) some text [visible text link](url)';
    const transformedText = MarkdownTransformer.create(markdownText).transform();
    expect(transformedText).toEqual(
      'visible text link [^anchor1] some text visible text link [^anchor1]\n\n[^anchor1]: url'
    );
  });
});
