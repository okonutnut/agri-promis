const Doc = () => (
  <Document>
    <Page
      size="FOLIO"
      orientation="landscape"
      style={{
        fontSize: "7",
        paddingVertical: "0.75in",
        paddingHorizontal: "0.7in",
      }}
    >
      <View
        style={{
          height: "57",
          display: "flex",
          flexDirection: "row",
          borderWidth: "0.7",
        }}
      >
        <View
          style={{
            width: 140,
            borderRightWidth: "0.7",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text>Image</Text>
        </View>
        <View
          style={{
            width: 300,
            borderRightWidth: "0.7",
            textAlign: "center",
            padding: "0.14in",
          }}
        >
          <Text style={{ fontWeight: "bold", marginTop: "2" }}>
            DEPARTMENT OF AGRICULTURE
          </Text>
          <Text style={{ fontWeight: "bold", marginTop: "3" }}>
            REGIONAL FIELD OFFICE NO. 02
          </Text>
        </View>
        <View style={{ flex: 1 }}>
          {/* Row 1 */}
          <View style={{ flex: 1, flexDirection: "row" }}>
            <Text
              style={{
                width: "55%",
                padding: 4,
                borderRightWidth: 0.7,
                borderBottomWidth: 0.7,
              }}
            >
              Document Code:
            </Text>
            <Text
              style={{
                flex: 1,
                padding: 4,
                borderBottomWidth: 0.7,
              }}
            >
              DARFO2.FOD.271
            </Text>
          </View>

          {/* Row 2 */}
          <View style={{ flex: 1, flexDirection: "row" }}>
            <Text
              style={{
                width: "55%",
                padding: 4,
                borderRightWidth: 0.7,
                borderBottomWidth: 0.7,
              }}
            >
              Effectivity Date:
            </Text>
            <Text
              style={{
                flex: 1,
                padding: 4,
                borderBottomWidth: 0.7,
              }}
            >
              July 1, 2025
            </Text>
          </View>

          {/* Row 3 */}
          <View style={{ flex: 1, flexDirection: "row" }}>
            <Text
              style={{
                width: "55%",
                padding: 4,
                borderRightWidth: 0.7,
              }}
            >
              Rev. No.:
            </Text>
            <Text
              style={{
                flex: 1,
                padding: 4,
              }}
            >
              0
            </Text>
          </View>
        </View>
      </View>
      <Text
        style={{
          textAlign: "center",
          marginTop: 24,
          marginBottom: 7,
          fontSize: 10,
          fontWeight: "bold",
        }}
      >
        POST TRAVEL REPORT
      </Text>

      {/* MAIN TABLE */}
      <View
        style={{
          height: 135,
          borderWidth: "0.7",
        }}
      >
        <View
          style={{
            height: 51,
            width: "100%",
            display: "flex",
            flexDirection: "row",
          }}
        >
          <View
            style={{
              width: 60,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              alignItems: "center",
              borderWidth: "0.7",
            }}
          >
            <Text
              style={{ textAlign: "center", marginTop: 10, fontWeight: "bold" }}
            >
              TRAVEL ORDER NO.
            </Text>
            <Text
              style={{
                marginTop: 10,
                marginBottom: 1,
              }}
            >
              (1)
            </Text>
          </View>
          <View
            style={{
              width: 79,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              alignItems: "center",
              borderBottomWidth: "0.7",
            }}
          >
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                gap: 3,
                fontWeight: "bold",
                marginTop: 3,
              }}
            >
              <Text>INCLUSIVE</Text>
              <Text>DATE(S)</Text>
              <Text>OF</Text>
              <Text>TRAVEL</Text>
            </View>
            <Text
              style={{
                marginTop: 10,
                marginBottom: 1,
              }}
            >
              (2)
            </Text>
          </View>
          <View
            style={{
              width: 125,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              alignItems: "center",
              borderWidth: "0.7",
            }}
          >
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                gap: 3,
                fontWeight: "bold",
                marginTop: 3,
              }}
            >
              <Text>PROJECT /</Text>
              <Text>PLACES</Text>
              <Text>VISITED</Text>
            </View>
            <Text
              style={{
                marginTop: 10,
                marginBottom: 1,
              }}
            >
              (3)
            </Text>
          </View>
          <View
            style={{
              width: 175,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              alignItems: "center",
              borderBottomWidth: "0.7",
            }}
          >
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                gap: 3,
                fontWeight: "bold",
                marginTop: 3,
              }}
            >
              <Text>ACTIVITIES UNDERTAKEN</Text>
              <Text>(Pls. Capsulized, quantify, &</Text>
              <Text>indicate appropriate</Text>
              <Text>parameters/indicators)</Text>
            </View>
            <Text
              style={{
                marginTop: 10,
                marginBottom: 1,
              }}
            >
              (4)
            </Text>
          </View>
          <View
            style={{
              width: 217,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              alignItems: "center",
              borderWidth: "0.7",
            }}
          >
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                gap: 3,
                fontWeight: "bold",
                marginTop: 3,
              }}
            >
              <Text>ISSUES/CONCERNS/PROJECT</Text>
              <Text>% ACCOMPLISHMENT TO DATE</Text>
            </View>
            <Text
              style={{
                marginTop: 10,
                marginBottom: 1,
              }}
            >
              (5)
            </Text>
          </View>
          <View
            style={{
              flex: "1",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              alignItems: "center",
              borderBottomWidth: "0.7",
            }}
          >
            <Text
              style={{ textAlign: "center", fontWeight: "bold", marginTop: 3 }}
            >
              REMARKS/RECOMENDATION
            </Text>
            <Text style={{ marginBottom: 1 }}>(6)</Text>
          </View>
        </View>
        /* ENTRY */
        <View
          style={{
            flex: "1",
            width: "100%",
            display: "flex",
            flexDirection: "row",
          }}
        >
          <View
            style={{
              width: 60,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              borderRightWidth: "0.7",
              padding: 5,
            }}
          >
            <Text style={{ textAlign: "center" }}>25-11-026</Text>
          </View>
          <View
            style={{
              width: 79,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              borderRightWidth: "0.7",
              padding: 5,
            }}
          >
            <Text style={{ textAlign: "center" }}>November 5-7, 2025</Text>
          </View>
          <View
            style={{
              width: 125,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              borderRightWidth: "0.7",
              padding: 5,
            }}
          >
            <Text style={{ textAlign: "center" }}>
              Mango suites, Cauayan City, Isabela
            </Text>
          </View>
          <View
            style={{
              width: 175,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              padding: 5,
              borderRightWidth: "0.7",
            }}
          >
            <Text style={{ textAlign: "center" }}>
              To participate in the Joint Planning Exercise (JPE) with Local
              Government Units and Stakeholders
            </Text>
          </View>
          <View
            style={{
              width: 217,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              padding: 5,
              borderRightWidth: "0.7",
            }}
          >
            <Text style={{ textAlign: "center" }}>
              Participated and facilitated in the Joint Planning Exercise (JPE)
              with Local Government Units and Stakeholders
            </Text>
          </View>
          <View
            style={{
              flex: "1",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              padding: 5,
            }}
          >
            <Text style={{ textAlign: "center" }}></Text>
          </View>
        </View>
      </View>

      {/* SIGNATURES */}
      <View
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "row",
          marginTop: 3,
        }}
      >
        <Text style={{ width: 262 }}>Prepared by:</Text>
        <Text style={{ width: 176 }}>Reviewed by:</Text>
        <Text style={{ width: 215 }}>Recommending Approval:</Text>
        <Text style={{ flex: 1 }}>Approved by:</Text>
      </View>
      <View
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "row",
          marginTop: 20,
        }}
      >
        {/* PREPARED BY */}
        <View
          style={{
            width: 262,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text style={{ textDecoration: "underline", marginBottom: 3 }}>
            JEYSAN PUDDUNAN
          </Text>
          <Text>Agriculturist 1</Text>
        </View>
        <View
          style={{
            width: 176,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text style={{ textDecoration: "underline", marginBottom: 3 }}>
            JONATHAN L. ARGONIA
          </Text>
          <Text>Agri II/APCO</Text>
        </View>
        <View
          style={{
            width: 215,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text style={{ textDecoration: "underline", marginBottom: 3 }}>
            MARVIN B. LUIS, DPA
          </Text>
          <Text>OIC-Chief, Field Operations Division</Text>
        </View>
        <View
          style={{
            flex: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text style={{ textDecoration: "underline", marginBottom: 3 }}>
            ROBERTO C. BUSANIA, DVM
          </Text>
          <Text>RTD for Operations and Extension</Text>
        </View>
      </View>
    </Page>
  </Document>
);

ReactPDF.render(<Doc />);
