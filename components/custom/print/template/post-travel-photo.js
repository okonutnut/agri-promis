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
            width: 130,
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
          height: 220,
          borderWidth: "1",
        }}
      >
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
              flex: 1,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              borderRightWidth: "0.7",
              padding: 5,
            }}
          >
            <Text style={{ textAlign: "center" }}>image</Text>
          </View>
          <View
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              borderRightWidth: "0.7",
              padding: 5,
            }}
          >
            <Text style={{ textAlign: "center" }}>image</Text>
          </View>
          <View
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              padding: 5,
            }}
          >
            <Text style={{ textAlign: "center" }}>image</Text>
          </View>
        </View>
      </View>
      {/* SIGNATURES */}
      <View
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "row",
          borderWidth: 1,
          borderTopWidth: 0,
        }}
      >
        <Text style={{ width: 254, borderRightWidth: 1, padding: 1 }}>
          Project Title/Activity: JOINT PLANNING EXERCISE
        </Text>
        <Text style={{ width: 394, borderRightWidth: 1, padding: 1 }}>
          Location: CAUAYAN CITY, ISABELA
        </Text>
        <Text style={{ flex: 1, padding: 1 }}>ICC/FCA/LGU Name:</Text>
      </View>
      <View
        style={{
          height: 15,
          width: "100%",
          display: "flex",
          flexDirection: "row",
          borderWidth: 1,
          borderTopWidth: 0,
        }}
      >
        <Text style={{ width: 254, borderRightWidth: 1, padding: 1 }}></Text>
        <Text style={{ width: 394, borderRightWidth: 1, padding: 1 }}></Text>
        <Text style={{ flex: 1, padding: 1 }}></Text>
      </View>

      {/* SIGNATURES */}
      <View
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "row",
          borderWidth: 1,
          borderTopWidth: 0,
        }}
      >
        <Text style={{ width: 254, borderRightWidth: 1, padding: 1 }}>
          Prepared by:
        </Text>
        <Text style={{ width: 176, borderRightWidth: 1, padding: 1 }}>
          Reviewed by:
        </Text>
        <Text style={{ width: 218, borderRightWidth: 1, padding: 1 }}>
          Recommending Approval:
        </Text>
        <Text style={{ flex: 1, padding: 1 }}>Approved by:</Text>
      </View>

      <View
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "row",
          borderWidth: 1,
          borderTopWidth: 0,
        }}
      >
        {/* PREPARED BY */}
        <View
          style={{
            width: 254,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            borderRightWidth: 1,
          }}
        >
          <Text
            style={{
              width: "100%",
              textAlign: "center",
              marginBottom: 3,
              paddingTop: 15,
              borderBottomWidth: 1,
            }}
          >
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
            borderRightWidth: 1,
          }}
        >
          <Text
            style={{
              width: "100%",
              textAlign: "center",
              marginBottom: 3,
              paddingTop: 15,
              borderBottomWidth: 1,
            }}
          >
            JONATHAN L. ARGONIA
          </Text>
          <Text>Agri II/APCO</Text>
        </View>
        <View
          style={{
            width: 218,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            borderRightWidth: 1,
          }}
        >
          <Text
            style={{
              width: "100%",
              textAlign: "center",
              marginBottom: 3,
              paddingTop: 15,
              borderBottomWidth: 1,
            }}
          >
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
          <Text
            style={{
              width: "100%",
              textAlign: "center",
              marginBottom: 3,
              paddingTop: 15,
              borderBottomWidth: 1,
            }}
          >
            ROBERTO C. BUSANIA, DVM
          </Text>
          <Text>RTD for Operations and Extension</Text>
        </View>
      </View>
    </Page>
  </Document>
);

ReactPDF.render(<Doc />);
