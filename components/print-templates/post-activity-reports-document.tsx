import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
  Image,
} from "@react-pdf/renderer";
import { MonitoringReportType } from "@/components/types";

// Register the Cambria font
Font.register({
  family: "Cambria",
  src: "/fonts/Cambria.ttf",
});
Font.register({
  family: "Cambria",
  src: "/fonts/Cambriab.ttf",
  fontWeight: "bold",
});

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#FFFFFF",
    padding: 20,
    fontSize: 10,
    fontFamily: "Cambria",
  },
  header: {
    display: "flex",
    flexDirection: "row",
    gap: 10,
    textAlign: "center",
    marginBottom: 10,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  pageTitle: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 20,
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  table: {
    width: "100%",
    borderLeftStyle: "solid",
    borderLeftWidth: 1,
    borderLeftColor: "#000000",
    borderTopStyle: "solid",
    borderTopWidth: 1,
    borderTopColor: "#000000",
    borderRightStyle: "solid",
    borderRightWidth: 1,
    borderRightColor: "#000000",
    marginBottom: 30,
  },
  tableRow: {
    flexDirection: "row",
    minHeight: 50,
  },
  tableColHeader: {
    borderRightStyle: "solid",
    borderRightWidth: 1,
    borderRightColor: "#000000",
    borderBottomStyle: "solid",
    borderBottomWidth: 1,
    borderBottomColor: "#000000",
    padding: 8,
    fontSize: 9,
    fontWeight: "bold",
    textAlign: "center",
    alignItems: "center",
    justifyContent: "center",
    minHeight: 50,
  },
  tableCol: {
    borderRightStyle: "solid",
    borderRightWidth: 1,
    borderRightColor: "#000000",
    borderBottomStyle: "solid",
    borderBottomWidth: 1,
    borderBottomColor: "#000000",
    padding: 6,
    fontSize: 8.5,
    textAlign: "left",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    minHeight: 35,
  },
  tableCellCentered: {
    textAlign: "center",
    alignItems: "center",
    justifyContent: "center",
  },
  tableCellMerged: {
    borderBottomWidth: 0,
  },
  tableCellMergedMiddle: {
    borderBottomWidth: 0,
    borderTopWidth: 0,
  },
  tableCellMergedLast: {
    borderTopWidth: 0,
  },
  lastCol: {
    borderRightWidth: 0,
  },
  // Column widths
  toCol: { width: "10%" },
  dateCol: { width: "10%" },
  projectCol: { width: "13%" },
  activitiesCol: { width: "20%" },
  issuesCol: { width: "32%" },
  remarksCol: { width: "25%" },

  signatureSection: {
    marginTop: 50,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 40,
  },
  signatureBox: {
    width: "40%",
  },
  signatureLine: {
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    marginBottom: 8,
    paddingTop: 40,
  },
  signatureName: {
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 11,
    marginBottom: 2,
  },
  signatureTitle: {
    textAlign: "center",
    fontSize: 9,
  },
});

type PostActivityReportTemplateProps = {
  data: MonitoringReportType[];
};
const PostActivityReportTemplate = ({
  data,
}: PostActivityReportTemplateProps) => (
  <Document>
    <Page
      size={{ width: 8.5 * 72, height: 13 * 72 }}
      style={styles.page}
      orientation="landscape"
    >
      {/* HEADER */}
      <View style={styles.header}>
        <Image src="/da-logo.png" style={{ width: 50, height: 50 }} />
        <View style={{ fontSize: 10 }}>
          <Text style={{ fontWeight: "bold" }}>
            Republic of the Philippines
          </Text>
          <Text style={{ fontWeight: "bold", fontSize: 11 }}>
            REGIONAL FIELD OFFICE NO. 02
          </Text>
          <Text>AGRI-PROMIS</Text>
        </View>
      </View>

      {/* PAGE TITLE */}
      <Text style={styles.pageTitle}>Post Activity Report</Text>

      {/* TABLE */}
      <View style={styles.table}>
        {/* TABLE HEADER */}
        <View style={styles.tableRow}>
          <View style={[styles.tableColHeader, styles.toCol]}>
            <Text>T.O. No.</Text>
          </View>
          <View style={[styles.tableColHeader, styles.dateCol]}>
            <Text>Inclusive Date{"\n"}of Travel</Text>
          </View>
          <View style={[styles.tableColHeader, styles.projectCol]}>
            <Text>Project/Places{"\n"}Visited</Text>
          </View>
          <View style={[styles.tableColHeader, styles.activitiesCol]}>
            <Text>Activities{"\n"}Undertaken</Text>
          </View>
          <View style={[styles.tableColHeader, styles.issuesCol]}>
            <Text>Issues/Concerns/Project %{"\n"}Accomplishments to Date</Text>
          </View>
          <View
            style={[styles.tableColHeader, styles.remarksCol, styles.lastCol]}
          >
            <Text>Remarks</Text>
          </View>
        </View>

        {/* ROW */}
        {data.map((row, index) => (
          <View style={styles.tableRow} key={index}>
            {/* TO NO */}
            {index === 0 ||
            row.travel_order?.travel_order_no !==
              data[index - 1].travel_order?.travel_order_no ? (
              <View
                style={[
                  styles.tableCol,
                  styles.toCol,
                  styles.tableCellCentered,
                  styles.tableCellMerged,
                ]}
              >
                <Text>{row.travel_order?.travel_order_no}</Text>
              </View>
            ) : index === data.length - 1 ||
              row.travel_order?.travel_order_no !==
                data[index + 1].travel_order?.travel_order_no ? (
              <View
                style={[
                  styles.tableCol,
                  styles.toCol,
                  styles.tableCellCentered,
                  styles.tableCellMergedLast,
                ]}
              >
                <Text></Text>
              </View>
            ) : (
              <View
                style={[
                  styles.tableCol,
                  styles.toCol,
                  styles.tableCellCentered,
                  styles.tableCellMergedMiddle,
                ]}
              >
                <Text></Text>
              </View>
            )}

            {/* DATE */}
            <View
              style={[
                styles.tableCol,
                styles.dateCol,
                styles.tableCellCentered,
              ]}
            >
              <Text>July 15, 2025</Text>
            </View>

            {/* PROJECT */}
            <View style={[styles.tableCol, styles.projectCol]}>
              <Text>{row.project?.project_name}</Text>
            </View>

            {/* ACTIVITIES */}
            <View style={[styles.tableCol, styles.activitiesCol]}>
              <Text>{row.purpose}</Text>
            </View>

            {/* ISSUES */}
            <View style={[styles.tableCol, styles.issuesCol]}>
              {row.issues_concern?.map((item, idx) => (
                <Text key={idx}>
                  {idx + 1}. {item ?? ""}
                </Text>
              ))}
            </View>

            {/* REMARKS */}
            <View style={[styles.tableCol, styles.remarksCol, styles.lastCol]}>
              <Text>{row.remarks as string}</Text>
            </View>
          </View>
        ))}
      </View>
    </Page>
  </Document>
);

export default PostActivityReportTemplate;
