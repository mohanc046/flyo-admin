import _ from "lodash";
import moment from "moment";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import currencyFormatter from "currency-formatter";
import { uploadToS3 } from "./awsConfig";
import { notification } from "antd";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile } from "@ffmpeg/util";

export const getUserType = () => {
  let baseURL = window.location.pathname;

  return `${baseURL}`.includes("user") ? "BUYER" : "STORE OWNER";
};

export const isMobileView = () => {
  return window.innerWidth <= 768;
};

export const getServiceURL = () => {
  let SERVICE_URL = "http://localhost:3005/v1";

  let IS_LOCALHOST = `${window.location.hostname}`.includes("localhost");

  if (!IS_LOCALHOST) {
    SERVICE_URL = process.env.REACT_APP_SERVICE_API;
  }

  return SERVICE_URL;
};

export function isImageUrl(url) {
  return `${url}`?.match(/\.(jpeg|jpg|gif|png|avif|webp)/) != null;
}

export function isVideoUrl(url) {
  return `${url}`?.match(/\.(mp4|webm|ogg|mov)$/i) != null;
}

export const getFormattedCurrency = (value) => {
  return currencyFormatter.format(value, { code: "INR" });
};

export const getTimeAgo = (date) => {
  const propsDate = moment(date);

  const now = moment();

  // Calculate the difference in minutes
  const minutesDifference = now.diff(propsDate, "minutes");

  // Calculate the difference in hours
  const hoursDifference = now.diff(propsDate, "hours");

  // Calculate the difference in days
  const daysDifference = now.diff(propsDate, "days");

  if (minutesDifference < 60) {
    return `${minutesDifference} minute${minutesDifference > 1 ? "s" : ""} ago`;
  } else if (hoursDifference < 24) {
    return `${hoursDifference} hour${hoursDifference > 1 ? "s" : ""} ago`;
  } else {
    return `${daysDifference} day${daysDifference > 1 ? "s" : ""} ago`;
  }
};

export function formatDateToDDMMYYYY(dateString) {
  const date = new Date(dateString); // Convert string to Date object
  const day = String(date.getDate()).padStart(2, "0"); // Get day with leading zero
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Get month with leading zero
  const year = date.getFullYear(); // Get year
  return `${day}-${month}-${year}`; // Return formatted string
}

export const generateXlsxReport = (data, fileName) => {
  const wb = XLSX.utils.book_new();

  const ws = XLSX.utils.aoa_to_sheet(data);

  XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

  const wbout = XLSX.write(wb, { bookType: "xlsx", type: "binary" });

  const buffer = new ArrayBuffer(wbout.length);

  const view = new Uint8Array(buffer);

  for (let i = 0; i < wbout.length; i++) {
    view[i] = wbout.charCodeAt(i) & 0xff;
  }

  const blob = new Blob([buffer], { type: "application/octet-stream" });

  saveAs(blob, `${fileName}.xlsx`);
};

export const formatDomainName = (domain) => {
  // Remove spaces, special characters, and ensure the domain starts and ends without hyphens
  return domain
    .toLowerCase() // Convert to lowercase
    .replace(/\s+/g, "") // Remove spaces
    .replace(/[^a-z0-9\-]/g, "") // Remove special characters
    .replace(/^-+|-+$/g, ""); // Remove leading and trailing hyphens
};

export const processAndUploadVideo = async (file) => {
  const ffmpeg = new FFmpeg();

  try {
    if (!ffmpeg.loaded) {
      await ffmpeg.load();
    }

    // Load file into FFmpeg
    ffmpeg.writeFile("input.mp4", await fetchFile(file));

    // Apply video processing
    await ffmpeg.exec([
      "-i",
      "input.mp4",
      "-c:v",
      "libx264",
      "-b:v",
      "3500k",
      "-r",
      "30",
      "-preset",
      "fast",
      "-c:a",
      "aac",
      "-b:a",
      "128k",
      "-ar",
      "44100",
      "-vf",
      "scale=1080:1920",
      "output.mp4"
    ]);

    // Get the processed video
    const data = await ffmpeg.readFile("output.mp4");

    // Convert to a Blob & File
    const videoBlob = new Blob([data], { type: "video/mp4" });
    const processedFile = new File([videoBlob], `processed-${file.name}`, { type: "video/mp4" });

    // Upload to S3
    return uploadToS3(processedFile);
  } catch (error) {
    console.error("Video processing failed:", error);
    notification.open({
      type: "warning",
      message: "Error processing video before upload!"
    });
  }
};
