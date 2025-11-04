import fetch from "node-fetch";
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  Header,
  Footer,
  ImageRun,
  AlignmentType,
  BorderStyle,
  WidthType,
} from "docx";
import { MonitoringReportType } from "@/components/types";

async function fetchImageBuffer(src: string): Promise<Buffer> {
  const res = await fetch(src);
  const arr = await res.arrayBuffer();
  return Buffer.from(arr);
}

export async function generateReportDocx(
  data: MonitoringReportType
): Promise<Response> {
  const headerImg = await fetchImageBuffer("/assets/header.jpg");
  const footerImg = await fetchImageBuffer("/assets/footer.jpg");

  const header = new Header({
    children: [
      new Paragraph({
        children: [
          new ImageRun({
            data: headerImg,
            transformation: { width: 595, height: 90 },
            type: "jpg",
          }),
        ],
        spacing: { after: 0, before: 0 },
      }),
      new Paragraph({
        children: [
          new TextRun({
            text: "DA-RF02.NVES.124.21",
            size: 10 * 2,
          }),
        ],
        alignment: AlignmentType.RIGHT,
        spacing: { after: 0, before: 0 },
      }),
    ],
  });

  const footer = new Footer({
    children: [
      new Paragraph({
        children: [
          new ImageRun({
            data: footerImg,
            transformation: { width: 595, height: 50 },
            type: "jpg",
          }),
        ],
        spacing: { after: 0, before: 0 },
      }),
    ],
  });

  // Contact section with explicit two‑column table and reduced cell padding
  const contactRows: TableRow[] = [];
  function addRow(label: string, value: string) {
    contactRows.push(
      new TableRow({
        children: [
          new TableCell({
            width: { size: 30, type: WidthType.PERCENTAGE },
            children: [
              new Paragraph({
                children: [new TextRun({ text: label, size: 11 * 2 })],
                spacing: { before: 0, after: 0 },
              }),
            ],
            margins: { top: 0, bottom: 0, left: 0, right: 0 },
            verticalAlign: "top",
          }),
          new TableCell({
            width: { size: 70, type: WidthType.PERCENTAGE },
            children: [
              new Paragraph({
                children: [new TextRun({ text: value, size: 11 * 2 })],
                spacing: { before: 0, after: 0 },
              }),
            ],
            margins: { top: 0, bottom: 0, left: 0, right: 0 },
            verticalAlign: "top",
          }),
        ],
      })
    );
  }

  addRow("Municipality:", "FIX THIS!!!  ");
  // addRow("Contact Person:", data.project?.contactPerson ?? "");
  // if (data.project?.fcaDetails && data.project.fcaDetails.length > 0) {
  //   addRow("FCA:", data.project.fcaDetails[0].description ?? "");
  //   for (let i = 1; i < data.project.fcaDetails.length; i++) {
  //     addRow("", data.project.fcaDetails[i].description ?? "");
  //   }
  // }
  addRow("Purpose:", data.purpose ?? "");
  addRow(
    "Date Monitored:",
    new Date(data.created_at ?? "").toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "2-digit",
    })
  );

  const contactTable = new Table({
    rows: contactRows,
    width: { size: 100, type: WidthType.PERCENTAGE },
    columnWidths: [30, 70],
  });

  // Bullet list with hanging indent, smaller line spacing after
  const findingParas = (data.findings ?? [])
    .filter((f) => f && f.trim() !== "")
    .map(
      (f) =>
        new Paragraph({
          bullet: { level: 0 },
          children: [new TextRun({ text: f, size: 11 * 2 })],
          spacing: { before: 0, after: 80, line: 360 }, // line spacing adjustment
          indent: { left: 720, hanging: 360 }, // adjust to approximate your PDF bullet spacing
        })
    );

  // Image grid with two columns
  const photos = data.photo_url ?? [];
  const photoRows: TableRow[] = [];
  for (let i = 0; i < photos.length; i += 2) {
    const cells: TableCell[] = [];
    for (let j = 0; j < 2; j++) {
      const url = photos[i + j];
      if (url) {
        const buf = await fetchImageBuffer(url);
        cells.push(
          new TableCell({
            width: { size: 50, type: WidthType.PERCENTAGE },
            children: [
              new Paragraph({
                children: [
                  new ImageRun({
                    data: buf,
                    transformation: { width: 250, height: 150 },
                    type: "jpg",
                  }),
                ],
                spacing: { before: 0, after: 0 },
              }),
            ],
            margins: { top: 0, bottom: 0, left: 0, right: 0 },
          })
        );
      } else {
        cells.push(
          new TableCell({
            width: { size: 50, type: WidthType.PERCENTAGE },
            children: [new Paragraph("")],
            margins: { top: 0, bottom: 0, left: 0, right: 0 },
          })
        );
      }
    }
    photoRows.push(new TableRow({ children: cells }));
  }

  const imageTable = new Table({
    rows: photoRows,
    width: { size: 100, type: WidthType.PERCENTAGE },
    columnWidths: [50, 50],
  });

  // Horizontal rule
  const hrParagraph = new Paragraph({
    border: {
      bottom: {
        style: BorderStyle.SINGLE,
        size: 6,
        color: "000000",
      },
    },
    children: [new TextRun({ text: "", size: 1 })],
    spacing: { before: 200, after: 200 },
  });

  // Main document
  const doc = new Document({
    sections: [
      {
        headers: { default: header },
        footers: { default: footer },
        properties: {
          page: {
            margin: { top: 100, bottom: 100, left: 50, right: 50 },
          },
        },
        children: [
          new Paragraph({
            children: [
              new TextRun({
                text: "MONITORING AND EVALUATION REPORT",
                bold: true,
                size: 12 * 2,
              }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { before: 300, after: 300 },
          }),

          contactTable,

          new Paragraph({
            children: [
              new TextRun({
                text: data.observation
                  ? "Findings:"
                  : "Findings / Observation:",
                bold: true,
                size: 12 * 2,
              }),
            ],
            spacing: { before: 200, after: 100 },
          }),

          ...findingParas,

          new Paragraph({ children: [], pageBreakBefore: true }),

          new Paragraph({
            children: [
              new TextRun({
                text: "PHOTO DOCUMENTATION",
                bold: true,
                size: 12 * 2,
              }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { before: 300, after: 300 },
          }),

          imageTable,

          hrParagraph,
          new Paragraph({
            children: [new TextRun({ text: "Monitored by:", size: 11 * 2 })],
            spacing: { before: 200, after: 0 },
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: data.reporter?.fullname ?? "",
                size: 11 * 2,
              }),
            ],
            spacing: { after: 0, before: 0 },
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: data.reporter?.position ?? "",
                size: 11 * 2,
              }),
            ],
            spacing: { after: 0, before: 0 },
          }),
        ],
      },
    ],
  });

  const buffer = await Packer.toBuffer(doc);

  return new Response(new Uint8Array(buffer), {
    status: 200,
    headers: {
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "Content-Disposition": 'attachment; filename="monitoring_report.docx"',
    },
  });
}
