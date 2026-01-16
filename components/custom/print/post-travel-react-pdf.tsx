import { Document, Page, Text, View, Font, Image } from "@react-pdf/renderer";
import { PostTravelReportType } from "@/components/types";
import { format } from "date-fns";

// Constants
const DEFAULT_DOCUMENT_CODE = "DARFO2.FOD.271";
const DEFAULT_EFFECTIVITY_DATE = "7/1/2025";
const DEFAULT_REV_NO = "0";
const DEFAULT_PREPARED_BY_TITLE = "Agriculturist I";
const DEFAULT_REVIEWED_BY_NAME = "JONATHAN L. ARGONIA";
const DEFAULT_REVIEWED_BY_TITLE = "Agri II/APCO";
const DEFAULT_RECOMMENDING_APPROVAL_NAME = "MARVIN B. LUIS, DPA";
const DEFAULT_RECOMMENDING_APPROVAL_TITLE = "OIC-Chief, Field Operations Division";
const DEFAULT_APPROVED_BY_NAME = "ROBERTO C. BUSANIA, DVM";
const DEFAULT_APPROVED_BY_TITLE = "RTD for Operations and Extension";

// Register Font
Font.register({
  family: "Cambria",
  src: "/fonts/Cambria.ttf",
});
Font.register({
  family: "Cambria",
  src: "/fonts/Cambriab.ttf",
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
      <Image src="/printing/image1.png" style={{ width: 70, height: 70 }} />
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

      {/* ENTRY */}
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
          <Text style={{ textAlign: "center" }}>{travelOrderNo}</Text>
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
          <Text style={{ textAlign: "center" }}>{inclusiveDates}</Text>
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
            borderRightWidth: "0.7",
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
            borderRightWidth: "0.7",
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
};
const SignatureSection = ({
  preparedBy,
  preparedByRole,
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
        <Text style={{ textDecoration: "underline", fontWeight: "bold", marginBottom: 3 }}>
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
        <Text style={{ textDecoration: "underline", fontWeight: "bold", marginBottom: 3 }}>
          {DEFAULT_REVIEWED_BY_NAME}
        </Text>
        <Text>{DEFAULT_REVIEWED_BY_TITLE}</Text>
      </View>
      <View
        style={{
          width: 215,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text style={{ textDecoration: "underline", fontWeight: "bold", marginBottom: 3 }}>
          {DEFAULT_RECOMMENDING_APPROVAL_NAME}
        </Text>
        <Text>{DEFAULT_RECOMMENDING_APPROVAL_TITLE}</Text>
      </View>
      <View
        style={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text style={{ textDecoration: "underline", fontWeight: "bold", marginBottom: 3 }}>
          {DEFAULT_APPROVED_BY_NAME}
        </Text>
        <Text>{DEFAULT_APPROVED_BY_TITLE}</Text>
      </View>
    </View>
  </>
);

// Main component
type PostTravelReactPDFProps = {
  data: PostTravelReportType;
};
export default function PostTravelReactPDF({ data }: PostTravelReactPDFProps) {
  // Format travel dates
  const formatTravelDates = (): string => {
    if (!data.travel_date?.date) return "";
    
    const startDate = format(new Date(data.travel_date.date), "PP");
    const endDate = data.travel_date.end_date
      ? format(new Date(data.travel_date.end_date), "PP")
      : null;
    
    return endDate ? `${startDate} - ${endDate}` : startDate;
  };

  const inclusiveDates = formatTravelDates();
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
          fontFamily: "Times-Roman",
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
          travelOrderNo={data.travel_order?.travel_order_no || ""}
          inclusiveDates={inclusiveDates}
          projectPlacesVisited={data.projects_places_visited || ""}
          activitiesUndertaken={data.activities_undertaken || ""}
          issuesConcerns={issuesConcerns}
          remarksRecommendation={data.remarks || ""}
        />
        <SignatureSection
          preparedBy={data.travel_order?.user?.fullname || data.user?.fullname || ""}
          preparedByRole={data.travel_order?.user?.position || ""}
        />
      </Page>
    </Document>
  );
}
