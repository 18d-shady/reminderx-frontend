export const getFileTypeIcon = (filename: string) => {
  const ext = filename?.split('.').pop()?.toLowerCase();

  if (!ext) return 'generic';

  const iconMap: Record<string, string> = {
    pdf: 'pdf',
    doc: 'word',
    docx: 'word',
    xls: 'excel',
    xlsx: 'excel',
    ppt: 'powerpoint',
    pptx: 'powerpoint',
    csv: 'spreadsheet',
    txt: 'text',
    rtf: 'text',
    zip: 'archive',
    rar: 'archive',
    '7z': 'archive',
    md: 'markdown',
    json: 'code',
    xml: 'code',
    log: 'terminal',
    jpg: 'image',
    jpeg: 'image',
    png: 'image',
    gif: 'image',
    svg: 'image',
    bmp: 'image',
    webp: 'image',
  };

  return iconMap[ext] || 'generic';
};
