package com.bookfair.Stall_Reservation.service.impl;

import com.bookfair.Stall_Reservation.entity.Reservation;
import com.bookfair.Stall_Reservation.service.EmailService;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.time.format.DateTimeFormatter;
import java.util.stream.Collectors;

@Service
public class EmailServiceImpl implements EmailService {

    private final JavaMailSender mailSender;

    private static final String SUPPORT_EMAIL = "support@bookfairmanagement.com";
    private static final String WEBSITE_URL = "https://bookfairmanagement.com";
    private static final String PHONE_NUMBER = "+91 98765 43210";
    private static final String SYSTEM_NAME = "Book Fair Management System";
    private static final DateTimeFormatter DATE_FMT = DateTimeFormatter.ofPattern("dd MMM yyyy, hh:mm a");

    public EmailServiceImpl(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    //SHARED TEMPLATE UTILITIES

    private String wrapInLayout(String headline, String headlineColor, String bodyContent) {
        return "<!DOCTYPE html>"
                + "<html lang='en'><head><meta charset='UTF-8'/>"
                + "<meta name='viewport' content='width=device-width, initial-scale=1.0'/>"
                + "<title>" + SYSTEM_NAME + "</title></head>"
                + "<body style='margin:0;padding:0;background-color:#f4f6f9;font-family:Arial,Helvetica,sans-serif;'>"
                + "<table role='presentation' width='100%' cellpadding='0' cellspacing='0' style='background-color:#f4f6f9;padding:30px 0;'>"
                + "<tr><td align='center'>"
                // Header Banner
                + "<table width='600' cellpadding='0' cellspacing='0' style='max-width:600px;width:100%;'>"
                + "<tr><td style='background:linear-gradient(135deg," + headlineColor
                + ",#1a237e);padding:28px 32px;border-radius:12px 12px 0 0;text-align:center;'>"
                + "<h1 style='margin:0;color:#ffffff;font-size:22px;font-weight:700;letter-spacing:0.5px;'>"
                + SYSTEM_NAME + "</h1>"
                + "</td></tr></table>"
                // Main Card
                + "<table width='600' cellpadding='0' cellspacing='0' style='max-width:600px;width:100%;background-color:#ffffff;border-radius:0 0 12px 12px;box-shadow:0 4px 20px rgba(0,0,0,0.08);'>"
                + "<tr><td style='padding:32px 36px;'>"
                + "<h2 style='margin:0 0 24px;color:#1a237e;font-size:20px;font-weight:700;border-bottom:3px solid "
                + headlineColor + ";padding-bottom:12px;'>" + headline + "</h2>"
                + bodyContent
                + "<hr style='border:none;border-top:1px solid #e0e0e0;margin:28px 0 20px;'/>"
                + "<p style='margin:0 0 6px;font-size:13px;color:#757575;'>Need help? Contact our support team:</p>"
                + "<p style='margin:0;font-size:13px;color:#1a237e;'>"
                + "&#9993; <a href='mailto:" + SUPPORT_EMAIL + "' style='color:#1a237e;text-decoration:none;'>"
                + SUPPORT_EMAIL + "</a>"
                + " &nbsp;|&nbsp; &#9742; " + PHONE_NUMBER + "</p>"
                + "</td></tr></table>"
                // Footer
                + "<table width='600' cellpadding='0' cellspacing='0' style='max-width:600px;width:100%;'>"
                + "<tr><td style='padding:20px 36px;text-align:center;'>"
                + "<p style='margin:0 0 4px;font-size:12px;color:#9e9e9e;'>&copy; " + java.time.Year.now().getValue()
                + " " + SYSTEM_NAME + ". All rights reserved.</p>"
                + "<p style='margin:0;font-size:12px;'><a href='" + WEBSITE_URL
                + "' style='color:#1a237e;text-decoration:none;'>" + WEBSITE_URL + "</a></p>"
                + "</td></tr></table>"
                + "</td></tr></table></body></html>";
    }

    private String badge(String text, String bgColor) {
        return "<span style='display:inline-block;padding:4px 14px;border-radius:20px;background-color:"
                + bgColor
                + ";color:#ffffff;font-size:12px;font-weight:700;letter-spacing:0.5px;text-transform:uppercase;'>"
                + text + "</span>";
    }

    private String detailRow(String label, String value) {
        return "<tr>"
                + "<td style='padding:8px 12px;font-size:14px;color:#616161;font-weight:600;border-bottom:1px solid #f5f5f5;width:40%;'>"
                + label + "</td>"
                + "<td style='padding:8px 12px;font-size:14px;color:#212121;border-bottom:1px solid #f5f5f5;'>"
                + safe(value) + "</td>"
                + "</tr>";
    }

    private String detailTable(String... rows) {
        StringBuilder sb = new StringBuilder();
        sb.append(
                "<table width='100%' cellpadding='0' cellspacing='0' style='border:1px solid #e0e0e0;border-radius:8px;overflow:hidden;margin:16px 0;'>");
        for (String row : rows) {
            sb.append(row);
        }
        sb.append("</table>");
        return sb.toString();
    }

    private String getStallCodes(Reservation r) {
        try {
            return r.getStalls().stream()
                    .map(rs -> rs.getStall().getStallCode())
                    .collect(Collectors.joining(", "));
        } catch (Exception e) {
            return "-";
        }
    }

    private String getGenres(Reservation r) {
        try {
            return r.getGenres().stream()
                    .map(rg -> rg.getGenre().getName())
                    .collect(Collectors.joining(", "));
        } catch (Exception e) {
            return "-";
        }
    }

    private String safe(Object val) {
        return val != null ? val.toString() : "-";
    }

    private String qrSection(boolean confirmed) {
        String note = confirmed
                ? "<p style='margin:12px 0 0;font-size:13px;color:#2e7d32;font-weight:600;'>&#10004; Present this QR code at the venue entry</p>"
                : "<p style='margin:12px 0 0;font-size:12px;color:#ef6c00;font-weight:600;'>&#9888; Valid only after payment confirmation</p>";
        String bg = confirmed ? "#e8f5e9" : "#f9fbe7";
        String border = confirmed ? "#66bb6a" : "#c5e1a5";
        return "<div style='text-align:center;margin:24px 0;padding:24px;background-color:" + bg
                + ";border-radius:8px;border:2px dashed " + border + ";'>"
                + "<p style='margin:0 0 12px;font-size:15px;font-weight:700;color:#33691e;'>Your Booking QR Code</p>"
                + "<img src='cid:qrCodeImage' alt='QR Code' style='width:200px;height:200px;border:4px solid #ffffff;border-radius:8px;box-shadow:0 2px 8px rgba(0,0,0,0.1);'/>"
                + note + "</div>";
    }

    @Override
    public void sendBookingConfirmation(Reservation reservation, byte[] qrPng) {

    }

    @Override
    public void sendCancellationNotice(Reservation reservation) {

    }

    @Override
    public void sendRefundNotice(Reservation reservation) {

    }

    @Override
    public void sendEventRemovedNotice(String vendorEmail, String eventName, String bookingId) {

    }

    @Override
    public void sendPaymentConfirmation(Reservation reservation, byte[] qrPng) {

    }

    @Override
    public void sendCancellationDeadlineReminder(Reservation reservation) {

    }

    @Override
    public void sendEventReminder(Reservation reservation) {

    }

    @Override
    public void sendVendorCancellationSuccess(Reservation reservation) {

    }

    @Override
    public void sendAccountDeactivatedNotice(String email, String name) {

    }
}
