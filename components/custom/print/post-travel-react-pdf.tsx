import { Document, Page, Text, View, Font, Image } from "@react-pdf/renderer";
import { format } from "date-fns";
import { PostTravelWithDetails } from "@/app/types";
import { PostTravelPrintSettingsType } from "@/app/dashboard/settings/components/postTravelPrint";

// Constants
const DEFAULT_DOCUMENT_CODE = "DARFO2.FOD.271";
const DEFAULT_EFFECTIVITY_DATE = "7/1/2025";
const DEFAULT_REV_NO = "0";

// Register Font
Font.register({
  family: "Cambria",
  src: "/fonts/Cambria.woff",
});
Font.register({
  family: "Cambria",
  src: "/fonts/Cambriab.woff",
  fontWeight: "bold",
});

// Helper component for header
type HeaderSectionProps = {
  documentCode?: string;
  effectivityDate?: string;
  revNo?: string;
};

const HeaderSection = ({
  documentCode = DEFAULT_DOCUMENT_CODE,
  effectivityDate = DEFAULT_EFFECTIVITY_DATE,
  revNo = DEFAULT_REV_NO,
}: HeaderSectionProps) => (
  <View
    style={{
      height: "57",
      display: "flex",
      flexDirection: "row",
      borderWidth: "1",
    }}
  >
    <View
      style={{
        width: 130,
        borderRightWidth: "1",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Image src="/printing/image1.png" style={{ width: 70, height: 70 }} />
    </View>
    <View
      style={{
        width: 300,
        borderRightWidth: "1",
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
      {/* DOCUMENT CODE */}
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
          {documentCode}
        </Text>
      </View>

      {/* EFFECTIVITY DATE */}
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
          {effectivityDate}
        </Text>
      </View>

      {/* REVISION NUMBER */}
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
          {revNo}
        </Text>
      </View>
    </View>
  </View>
);

// Helper component for main table
type MainTableProps = {
  travelOrderNo: string;
  inclusiveDates: string;
  projectPlacesVisited: string;
  activitiesUndertaken: string;
  issuesConcerns: string;
  remarksRecommendation: string;
};

const MainTable = ({
  travelOrderNo,
  inclusiveDates,
  projectPlacesVisited,
  activitiesUndertaken,
  issuesConcerns,
  remarksRecommendation,
}: MainTableProps) => {
  return (
    <View
      style={{
        height: 135,
        borderWidth: "1",
      }}
    >
      {/* HEADER */}
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
            borderRightWidth: "1",
            borderBottomWidth: "1",
            borderLeftWidth: "0",
            borderTopWidth: "0",
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
            borderBottomWidth: "1",
            borderRightWidth: "1",
            borderLeftWidth: "0",
            borderTopWidth: "0",
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
            borderRightWidth: "1",
            borderBottomWidth: "1",
            borderLeftWidth: "0",
            borderTopWidth: "0",
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
            borderBottomWidth: "1",
            borderRightWidth: "1",
            borderLeftWidth: "0",
            borderTopWidth: "0",
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
            borderBottomWidth: "1",
            borderRightWidth: "1",
            borderLeftWidth: "0",
            borderTopWidth: "0",
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
            borderBottomWidth: "1",
            borderLeftWidth: "0",
            borderTopWidth: "0",
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

      {/* BODY */}
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
            borderRightWidth: "1",
            padding: 5,
          }}
        >
          <Text style={{ textAlign: "center" }}>{travelOrderNo}</Text>
        </View>
        <View
          style={{
            width: 79,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            borderRightWidth: "1",
            padding: 5,
          }}
        >
          <Text style={{ textAlign: "center" }}>{inclusiveDates}</Text>
        </View>
        <View
          style={{
            width: 125,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            borderRightWidth: "1",
            padding: 5,
          }}
        >
          <Text style={{ textAlign: "center" }}>{projectPlacesVisited}</Text>
        </View>
        <View
          style={{
            width: 175,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            padding: 5,
            borderRightWidth: "1",
          }}
        >
          <Text style={{ textAlign: "center" }}>{activitiesUndertaken}</Text>
        </View>
        <View
          style={{
            width: 217,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            padding: 5,
            borderRightWidth: "1",
          }}
        >
          <Text style={{ textAlign: "center" }}>{issuesConcerns}</Text>
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
          <Text style={{ textAlign: "center" }}>{remarksRecommendation}</Text>
        </View>
      </View>
    </View>
  );
};

// Helper component for signatures
type SignatureSectionProps = {
  preparedBy: string;
  preparedByRole: string;
  printSettings: PostTravelPrintSettingsType | undefined;
};
const SignatureSection = ({
  preparedBy,
  preparedByRole,
  printSettings,
}: SignatureSectionProps) => (
  <>
    <View
      style={{
        width: "100%",
        display: "flex",
        flexDirection: "row",
        marginTop: 3,
      }}
    >
      <Text style={{ width: 254 }}>Prepared by:</Text>
      <Text style={{ width: 176 }}>Reviewed by:</Text>
      <Text style={{ width: 218 }}>Recommending Approval:</Text>
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
          width: 254,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text
          style={{
            textDecoration: "underline",
            fontWeight: "bold",
            marginBottom: 3,
          }}
        >
          {preparedBy.toUpperCase()}
        </Text>
        <Text>{preparedByRole}</Text>
      </View>
      <View
        style={{
          width: 176,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text
          style={{
            textDecoration: "underline",
            fontWeight: "bold",
            marginBottom: 3,
          }}
        >
          {printSettings?.reviewer?.toUpperCase()}
        </Text>
        <Text>{printSettings?.reviewerPosition as string}</Text>
      </View>
      <View
        style={{
          width: 218,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text
          style={{
            textDecoration: "underline",
            fontWeight: "bold",
            marginBottom: 3,
          }}
        >
          {printSettings?.recommendationApproval?.toUpperCase()}
        </Text>
        <Text>{printSettings?.recommendationApprovalPosition as string}</Text>
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
            textDecoration: "underline",
            fontWeight: "bold",
            marginBottom: 3,
          }}
        >
          {printSettings?.approver?.toUpperCase()}
        </Text>
        <Text>{printSettings?.approverPosition as string}</Text>
      </View>
    </View>
  </>
);

// Page 2 component
type PhotoDocumentPageProps = {
  projectTitle?: string;
  location?: string;
  iccFcaLguName?: string;
  preparedBy?: string;
  preparedByRole?: string;
  photoUrls?: string[];
};
const PhotoDocumentPage = ({
  projectTitle,
  location,
  iccFcaLguName,
  preparedBy,
  preparedByRole,
  photoUrls,
}: PhotoDocumentPageProps) => (
  <Page
    size="FOLIO"
    orientation="landscape"
    style={{
      fontFamily: "Cambria",
      fontSize: "7",
      paddingVertical: "0.75in",
      paddingHorizontal: "0.7in",
    }}
  >
    <HeaderSection
      documentCode={DEFAULT_DOCUMENT_CODE}
      effectivityDate={DEFAULT_EFFECTIVITY_DATE}
      revNo={DEFAULT_REV_NO}
    />
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
        {photoUrls &&
          photoUrls.map((url, index) => (
            <View
              key={index}
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                borderRightWidth: "1",
                padding: 5,
              }}
            >
              <Image
                src={url}
                style={{ width: "100%", height: "100%", objectFit: "contain" }}
              />
            </View>
          ))}
      </View>
    </View>

    {/* PROJECT INFORMATION */}
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
        Project Title/Activity: {projectTitle?.toUpperCase() || ""}
      </Text>
      <Text style={{ width: 394, borderRightWidth: 1, padding: 1 }}>
        Location: {location?.toUpperCase() || ""}
      </Text>
      <Text style={{ flex: 1, padding: 1 }}>
        ICC/FCA/LGU Name: {iccFcaLguName?.toUpperCase() || ""}
      </Text>
    </View>

    {/* EMPTY LINE */}
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
          {preparedBy?.toUpperCase() || ""}
        </Text>
        <Text>{preparedByRole?.toWellFormed() || ""}</Text>
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
);

// Main component
type PostTravelReactPDFProps = {
  data: PostTravelWithDetails;
  printSettings: PostTravelPrintSettingsType | undefined;
  projectTitle?: string;
  iccFcaLguName?: string;
};
export default function PostTravelReactPDF({
  data,
  printSettings,
  projectTitle,
  iccFcaLguName,
}: PostTravelReactPDFProps) {
  const inclusiveDates = () => {
    if (!data?.date) return "N/A";
    const startDate = format(new Date(data.date), "MMM d, yyyy");
    if (!data.end_date) return startDate;
    const endDate = format(new Date(data.end_date), "MMM d, yyyy");
    return `${startDate} - ${endDate}`;
  };
  const issuesConcerns = Array.isArray(data.issues_concern)
    ? data.issues_concern.join("\n")
    : data.issues_concern || "";

  return (
    <Document>
      {/* First Page */}
      <Page
        size="FOLIO"
        orientation="landscape"
        style={{
          fontSize: "7",
          paddingVertical: "0.75in",
          paddingHorizontal: "0.7in",
          fontFamily: "Cambria",
        }}
      >
        <HeaderSection
          documentCode={DEFAULT_DOCUMENT_CODE}
          effectivityDate={DEFAULT_EFFECTIVITY_DATE}
          revNo={DEFAULT_REV_NO}
        />
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
        <MainTable
          travelOrderNo={data?.travel_order_no || ""}
          inclusiveDates={inclusiveDates()}
          projectPlacesVisited={data.projects_places_visited || ""}
          activitiesUndertaken={data.activities_undertaken || ""}
          issuesConcerns={issuesConcerns}
          remarksRecommendation={data.remarks || ""}
        />
        <SignatureSection
          preparedBy={data.fullname || data.fullname || ""}
          preparedByRole={data?.position || ""}
          printSettings={printSettings}
        />
      </Page>

      {/* Photo Document Page */}
      {data.photo_url && data.photo_url.length > 0 && (
        <PhotoDocumentPage
          projectTitle={projectTitle || ""}
          location={data?.destination || ""}
          iccFcaLguName={iccFcaLguName || ""}
          preparedBy={data.fullname || data.fullname || ""}
          preparedByRole={data?.position || ""}
          photoUrls={data.photo_url || []}
        />
      )}
    </Document>
  );
}
