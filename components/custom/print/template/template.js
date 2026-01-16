var dd = {
  pageOrientation: "landscape",
  pageSize: "FOLIO",
  pageMargins: [50.4, 54, 50.4, 54],
  defaultStyle: {
    fontSize: 8,
  },
  content: [
    // HEADER
    {
      table: {
        widths: ["17%", "*", "26%", "21%"],
        body: [
          [
            {
              rowSpan: 3,
              text: "Image",
              alignment: "center",
              verticalAlignment: "middle",
            },
            {
              text: "DEPARTMENT OF AGRICULTURE",
              alignment: "center",
              verticalAlignment: "bottom",
              bold: true,
              margin: [0, 4.5, 0, 0],
              border: [true, true, true, false],
            },
            {
              text: "Document Code:",
              verticalAlignment: "bottom",
              margin: [0, 4.5, 0, 0],
            },
            {
              text: "DARFO2.FOD.271",
              verticalAlignment: "bottom",
              margin: [0, 4.5, 0, 0],
            },
          ],
          [
            "",
            {
              text: "REGIONAL FIELD OFFICE NO. 02",
              alignment: "center",
              verticalAlignment: "bottom",
              bold: true,
              margin: [0, 4.5, 0, 0],
              border: [false, false, false, false],
            },
            {
              text: "Effective Date:",
              verticalAlignment: "bottom",
              margin: [0, 4.5, 0, 0],
            },
            {
              text: "7/1/2025",
              verticalAlignment: "bottom",
              margin: [0, 4.5, 0, 0],
            },
          ],
          [
            "",
            { text: "", border: [true, false, true, true] },
            {
              text: "Rev. No.:",
              verticalAlignment: "bottom",
              margin: [0, 4.5, 0, 0],
            },
            { text: "0", verticalAlignment: "bottom", margin: [0, 4.5, 0, 0] },
          ],
        ],
      },
    },

    // PAGE TITLE
    {
      text: "POST TRAVEL REPORT",
      bold: true,
      fontSize: 9,
      alignment: "center",
      margin: [0, 25, 0, 9.1],
    },

    // MAIN TABLE
    {
      table: {
        headerRows: 2,
        heights: [10, 3, 45],
        widths: [47, 76, 115, 166, 210, "*"],
        body: [
          [
            {
              text: "TRAVEL ORDER \n NO.",
              alignment: "center",
              margin: [0, 8, 0, 0],
              border: [true, true, true, false],
            },
            {
              text: "INCLUSIVE \n DATE(S) \n OF \n TRAVEL",
              alignment: "center",
              border: [true, true, true, false],
            },
            {
              text: "PROJECT/ \n PLACES \n VISITED \n (Sto./Brgy/Mun/Prov)",
              alignment: "center",
              border: [true, true, true, false],
            },
            {
              text: "ACTIVITIES UNDERTAKEN \n (Pls. Capsulized, quantify, & \n indicate appropriate \n parameters / indicators)",
              alignment: "center",
              border: [true, true, true, false],
            },
            {
              text: "ISSUES/CONCERN/PROJECT \n % ACCOMPLISHMENT TO DATE",
              alignment: "center",
              border: [true, true, true, false],
            },
            {
              text: "REMARKS/RECOMENDATION",
              alignment: "center",
              border: [true, true, true, false],
            },
          ],
          [
            {
              text: "(1)",
              alignment: "center",
              border: [true, false, true, true],
            },
            {
              text: "(2)",
              alignment: "center",
              border: [true, false, true, true],
            },
            {
              text: "(3)",
              alignment: "center",
              border: [true, false, true, true],
            },
            {
              text: "(4)",
              alignment: "center",
              border: [true, false, true, true],
            },
            {
              text: "(5)",
              alignment: "center",
              border: [true, false, true, true],
            },
            {
              text: "(6)",
              alignment: "center",
              border: [true, false, true, true],
            },
          ],
          [
            {
              text: "25-146454",
              alignment: "center",
              margin: [0, 25],
            },
            {
              text: "November 5-7, 2025",
              alignment: "center",
              margin: [0, 25],
            },
            {
              text: "Mango suites, Cauayan City, Isabela",
              alignment: "center",
              margin: [0, 25],
            },
            {
              text: "To participate in the Joint Planning Exercise (JPE) with Local Government Units and Stakeholders",
              alignment: "center",
              margin: [0, 25],
            },
            {
              text: "Participated and facilitated in the Joint Planning Exercise (JPE) with Local Government Units and Stakeholders",
              alignment: "center",
              margin: [0, 25],
            },
            {
              text: "N/A",
              alignment: "center",
              margin: [0, 25],
            },
          ],
        ],
      },
    },

    // SIGNATURES
    {
      layout: "noBorders",
      table: {
        headerRows: 1,
        heights: [20, 20],
        widths: [132, 115, 166, 210, "*"],
        body: [
          [
            "Prepared by:",
            "",
            "Reviewed by:",
            "Recommending Approval:",
            "Approved by:",
          ],
          [
            {
              stack: [
                {
                  text: "JEYSAN B. PUDDUNAN",
                  alignment: "center",
                  bold: true,
                  decoration: "underline",
                },
                {
                  text: "Agriculturist I",
                  alignment: "center",
                  margin: [0, 5, 0, 0],
                },
              ],
            },
            "",
            {
              stack: [
                {
                  text: "JONATHAN L. ARGONIA",
                  alignment: "center",
                  bold: true,
                  decoration: "underline",
                },
                {
                  text: "Agri II/APCO",
                  alignment: "center",
                  margin: [0, 5, 0, 0],
                },
              ],
            },
            {
              stack: [
                {
                  text: "MARVIN B. LUIS, DPA",
                  alignment: "center",
                  bold: true,
                  decoration: "underline",
                },
                {
                  text: "OIC-Chief, Field Operations Division",
                  alignment: "center",
                  margin: [0, 5, 0, 0],
                },
              ],
            },
            {
              stack: [
                {
                  text: "ROBERTO C. BUSANIA, DVM",
                  alignment: "center",
                  bold: true,
                  fontSize: 6,
                  decoration: "underline",
                },
                {
                  text: "RTD for Operations and Extension",
                  alignment: "center",
                  fontSize: 6,
                  margin: [0, 5, 0, 0],
                },
              ],
            },
          ],
        ],
      },
      pageBreak: 'after',
    },

    // HEADER
    {
      table: {
        widths: ["17%", "*", "26%", "21%"],
        body: [
          [
            {
              rowSpan: 3,
              text: "Image",
              alignment: "center",
              verticalAlignment: "middle",
            },
            {
              text: "DEPARTMENT OF AGRICULTURE",
              alignment: "center",
              verticalAlignment: "bottom",
              bold: true,
              margin: [0, 4.5, 0, 0],
              border: [true, true, true, false],
            },
            {
              text: "Document Code:",
              verticalAlignment: "bottom",
              margin: [0, 4.5, 0, 0],
            },
            {
              text: "DARFO2.FOD.271",
              verticalAlignment: "bottom",
              margin: [0, 4.5, 0, 0],
            },
          ],
          [
            "",
            {
              text: "REGIONAL FIELD OFFICE NO. 02",
              alignment: "center",
              verticalAlignment: "bottom",
              bold: true,
              margin: [0, 4.5, 0, 0],
              border: [false, false, false, false],
            },
            {
              text: "Effective Date:",
              verticalAlignment: "bottom",
              margin: [0, 4.5, 0, 0],
            },
            {
              text: "7/1/2025",
              verticalAlignment: "bottom",
              margin: [0, 4.5, 0, 0],
            },
          ],
          [
            "",
            { text: "", border: [true, false, true, true] },
            {
              text: "Rev. No.:",
              verticalAlignment: "bottom",
              margin: [0, 4.5, 0, 0],
            },
            { text: "0", verticalAlignment: "bottom", margin: [0, 4.5, 0, 0] },
          ],
        ],
      },
    },

    // PAGE TITLE
    {
      text: "POST TRAVEL REPORT",
      bold: true,
      fontSize: 9,
      alignment: "center",
      margin: [0, 25, 0, 9.1],
    },

    // IMAGES
    {
      table: {
        heights: [210],
        widths: ["33.3%", "33.3%", "33.3%"],
        body: [["image", "image", "image"]],
      },
    },

    // PROJECT INFORMATION
    {
      table: {
        widths: [132, 115, 166, 210, "*"],
        body: [
          [
            {
              text: "Project Title/Activity: JOINT PLANNING EXERCISE",
              colSpan: 2,
            },
            "",
            { text: "Location: CAUAYAN CITY, ISABELA", colSpan: 2 },
            "",
            "ICC/FCA/LGU Name:",
          ],
          [
            { text: "", colSpan: 2 },
            "",
            { text: "", colSpan: 2 },
            "",
            { text: "" },
          ],
        ],
      },
    },

    // SIGNATURES
    {
      layout: "noBorders",
      table: {
        headerRows: 1,
        heights: [20, 20],
        widths: [132, 115, 166, 210, "*"],
        body: [
          [
            { text: "Prepared by:", colSpan: 2 },
            "",
            "Reviewed by:",
            "Recommending Approval:",
            "Approved by:",
          ],
          [
            {
              stack: [
                {
                  text: "JEYSAN B. PUDDUNAN",
                  alignment: "center",
                  bold: true,
                  decoration: "underline",
                },
                {
                  text: "Agriculturist I",
                  alignment: "center",
                  margin: [0, 5, 0, 0],
                },
              ],
            },
            "",
            {
              stack: [
                {
                  text: "JONATHAN L. ARGONIA",
                  alignment: "center",
                  bold: true,
                  decoration: "underline",
                },
                {
                  text: "Agri II/APCO",
                  alignment: "center",
                  margin: [0, 5, 0, 0],
                },
              ],
            },
            {
              stack: [
                {
                  text: "MARVIN B. LUIS, DPA",
                  alignment: "center",
                  bold: true,
                  decoration: "underline",
                },
                {
                  text: "OIC-Chief, Field Operations Division",
                  alignment: "center",
                  margin: [0, 5, 0, 0],
                },
              ],
            },
            {
              stack: [
                {
                  text: "ROBERTO C. BUSANIA, DVM",
                  alignment: "center",
                  bold: true,
                  fontSize: 6,
                  decoration: "underline",
                },
                {
                  text: "RTD for Operations and Extension",
                  alignment: "center",
                  fontSize: 6,
                  margin: [0, 5, 0, 0],
                },
              ],
            },
          ],
        ],
      },
    },
  ],
};
