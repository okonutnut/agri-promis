import React from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Font,
  Image,
} from "@react-pdf/renderer";
import { MonitoringReportType } from "@/components/types";
import { format } from "date-fns";

// Register the Cambria font
Font.register({
  family: "Cambria",
  src: "/fonts/cambria.ttf",
});
Font.register({
  family: "Cambria",
  src: "/fonts/cambriab.ttf",
  fontWeight: "bold",
});

// Create styles
const styles = StyleSheet.create({
  page: {
    paddingTop: 100,
    paddingHorizontal: 30,
    paddingBottom: 50,
    fontSize: 11,
    lineHeight: 1.5,
    color: "#000",
    backgroundColor: "#fff",
    fontFamily: "Cambria",
  },
  section: { marginBottom: 12, marginHorizontal: "0.5in" },
  heading: {
    fontSize: 12,
    marginVertical: 6,
    fontWeight: "bold",
    textAlign: "center",
  },
  headerImage: {
    position: "absolute",
    top: 1,
    left: 1,
    right: 1,
    width: "100%",
    height: 90,
    objectFit: "cover",
  },
  headerNumber: {
    position: "absolute",
    top: 50,
    right: 50, // Align to the right side of the page
    textAlign: "right",
    fontSize: 10,
  },
  footerImage: {
    position: "absolute",
    bottom: 1,
    left: 1,
    right: 1,
    width: "100%",
    height: 50,
    objectFit: "cover",
    zIndex: -1,
  },
  row: {
    flexDirection: "row",
    marginBottom: 8,
  },
  rowIndent: {
    flexDirection: "row",
    marginBottom: 0,
  },
  listItem: {
    flexDirection: "row",
    alignItems: "flex-start", // This ensures top alignment
    marginBottom: 5,
  },
  bullet: {
    width: 10,
    marginRight: 5,
    fontSize: 12,
    lineHeight: 1,
  },
  itemText: {
    flex: 1,
    lineHeight: 1, // Must match bullet lineHeight
    textAlign: "left",
  },
  label: { width: 120 },
  text: { marginBottom: 4 },
  subheading: { fontSize: 12, fontWeight: "bold", marginVertical: 6 },
  signature: { marginTop: 10, textAlign: "left" },
  imageGrid: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    justifyContent: "space-between",
  },
  imageWrapper: {
    width: "48%",
    marginBottom: 10,
  },
  image: {
    width: "100%",
    height: 150,
    objectFit: "contain",
  },
});

const BulletItem = ({ children }: { children: string }) => (
  <View style={styles.listItem}>
    <Text style={styles.bullet}>•</Text>
    <Text style={styles.itemText}>{children}</Text>
  </View>
);

type MonitoringReportDocumentProps = {
  data: MonitoringReportType | null;
};
export default function MonitoringReportDocument({
  data,
}: MonitoringReportDocumentProps) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* HEADER IMAGE */}
        <Image src="/assets/header.jpg" style={styles.headerImage} fixed />
        <Text style={styles.headerNumber} fixed>
          DA-RF02.NVES.124.21
        </Text>

        {/* DOCUMENT TITLE */}
        <View style={styles.section}>
          <Text style={styles.heading}>MONITORING AND EVALUATION REPORT</Text>
        </View>

        {/* CONTACT */}
        <View style={styles.section}>
          <View style={styles.row}>
            <Text style={styles.label}>Municipality:</Text>
            <Text>Bagabag, Nueva Vizcaya</Text>
          </View>
          <View style={styles.rowIndent}>
            <Text style={styles.label}>Contact Person:</Text>
            <Text>Charles S. Fernandez Jr. (Municipal Agriculturist)</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}></Text>
            <Text>Helen S. Apolonio (Agricultural Extension Worker)</Text>
          </View>
          <View
            style={[
              styles.rowIndent,
              data?.project?.fcaDetails?.length === 1
                ? { marginBottom: 8 }
                : {},
            ]}
          >
            <Text style={styles.label}>FCA:</Text>
            <Text>{data?.project?.fcaDetails?.[0]?.description ?? ""}</Text>
          </View>
          {data?.project?.fcaDetails?.slice(1).map((fca, index) => (
            <View style={styles.row} key={index}>
              <Text style={styles.label}></Text>
              <Text>{fca.description}</Text>
            </View>
          ))}
          <View style={styles.row}>
            <Text style={styles.label}>Purpose:</Text>
            <Text>{data?.purpose ?? ""}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Date Monitored:</Text>
            <Text>
              {format(new Date(data?.created_at ?? ""), "MMMM dd, yyyy")}
            </Text>
          </View>
        </View>

        {/* FINDINGS */}
        <View style={styles.section}>
          {data?.observation ? (
            <Text style={styles.subheading}>Findings:</Text>
          ) : (
            <Text style={styles.subheading}>Findings / Observation:</Text>
          )}
          {data?.findings &&
            data?.findings
              .filter((finding) => finding !== "")
              .map((finding, index) => (
                <BulletItem key={index}>{finding}</BulletItem>
              ))}
        </View>

        {/* OBSERVATION */}
        {data?.observation && (
          <View style={styles.section}>
            <Text style={styles.subheading}>Observation:</Text>
            <Text>{data?.observation ?? ""}</Text>
          </View>
        )}

        {/* ISSUES AND CONCERN */}
        <View style={styles.section}>
          <Text style={styles.subheading}>Issues and Concern:</Text>
          {data?.issues_concern &&
            data.issues_concern
              .filter((issue) => issue !== "")
              .map((issue, index) => (
                <BulletItem key={index}>{issue}</BulletItem>
              ))}
        </View>

        {/* REMARKS */}
        <View style={styles.section}>
          <Text style={styles.subheading}>Remarks:</Text>
          {data?.remarks && <Text>{data.remarks}</Text>}
        </View>

        {/* PHOTO DOCS */}
        <View style={[styles.section, { marginTop: 20 }]}>
          <Text style={styles.heading}>PHOTO DOCUMENTATION</Text>
          <View style={styles.imageGrid}>
            {data?.photo_url?.map((url, index) => (
              <View key={index} style={styles.imageWrapper}>
                <Image src={url} style={styles.image} />
              </View>
            ))}
          </View>
        </View>

        <View style={[styles.section, { marginTop: 20 }]}>
          <View
            style={{ borderBottom: "3px solid black", marginVertical: 10 }}
          ></View>
          <Text style={styles.signature}>Monitored by:</Text>
          <Text style={styles.signature}>{data?.reporter?.fullname}</Text>
          <Text style={styles.signature}>{data?.reporter?.position}</Text>
        </View>

        <Image src="/assets/footer.jpg" style={styles.footerImage} fixed />
      </Page>
    </Document>
  );
}
