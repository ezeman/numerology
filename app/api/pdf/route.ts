import { NextRequest } from 'next/server';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  const { title, inputs, result } = await req.json();
  const { default: PDFDocument } = await import('pdfkit');

  const doc: any = new (PDFDocument as any)({ margin: 50, size: 'A4' });
  const chunks: Buffer[] = [];
  const stream: any = doc;

  return await new Promise<Response>((resolve) => {
    stream.on('data', (chunk: any) => chunks.push(Buffer.from(chunk)));
    stream.on('end', () => {
      const pdfBuffer = Buffer.concat(chunks);
      resolve(
        new Response(pdfBuffer, {
          headers: {
            'Content-Type': 'application/pdf',
            'Content-Disposition': 'attachment; filename="numerology.pdf"',
          },
        })
      );
    });

    doc.fontSize(18).text(title || 'Numerology Pro Report', { align: 'center' });
    doc.moveDown();
    doc.fontSize(12).text(`Generated: ${new Date().toLocaleString('th-TH')}`);
    doc.moveDown();
    doc.fontSize(14).text('Inputs', { underline: true });
    doc.fontSize(12).text(JSON.stringify(inputs, null, 2));
    doc.moveDown();
    doc.fontSize(14).text('Result Summary', { underline: true });
    doc.fontSize(12).text(JSON.stringify(result?.summary || {}, null, 2));
    doc.moveDown();
    if (result?.pairs) {
      doc.fontSize(14).text('Pairs', { underline: true });
      result.pairs.forEach((p: any) => {
        doc.fontSize(12).text(`${p.pair}: ${p.meaning?.th || p.meaning?.en || ''} (score ${p.score})`);
      });
    }
    doc.end();
  });
}
