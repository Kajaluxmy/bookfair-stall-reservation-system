package com.bookfair.Stall_Reservation.service.impl;

import com.bookfair.Stall_Reservation.entity.*;
import com.bookfair.Stall_Reservation.enums.ReservationStatus;
import com.bookfair.Stall_Reservation.enums.UserRole;
import com.bookfair.Stall_Reservation.repository.*;
import com.bookfair.Stall_Reservation.service.AdminService;
import com.bookfair.Stall_Reservation.service.EmailService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class AdminServiceImpl implements AdminService {

    private final EventRepository eventRepository;
    private final ReservationRepository reservationRepository;
    private final PaymentRepository paymentRepository;
    private final UserRepository userRepository;
    private final ReservationGenreRepository reservationGenreRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;

    public AdminServiceImpl(EventRepository eventRepository,
                            ReservationRepository reservationRepository,
                            PaymentRepository paymentRepository,
                            UserRepository userRepository,
                            ReservationGenreRepository reservationGenreRepository,
                            PasswordEncoder passwordEncoder,
                            EmailService emailService) {
        this.eventRepository = eventRepository;
        this.reservationRepository = reservationRepository;
        this.paymentRepository = paymentRepository;
        this.userRepository = userRepository;
        this.reservationGenreRepository = reservationGenreRepository;
        this.passwordEncoder = passwordEncoder;
        this.emailService = emailService;
    }

    @Override
    public Map<String, Object> getDashboardStats() {
        long totalEvents = eventRepository.count();

        // Get received payments from payments table
        BigDecimal totalReceived = paymentRepository.totalReceived() != null ? paymentRepository.totalReceived()
                : BigDecimal.ZERO;

        // Get pending payments from payments table
        BigDecimal totalPendingFromPayments = paymentRepository.totalPending() != null ? paymentRepository.totalPending()
                : BigDecimal.ZERO;

        // ALSO get pending payments from reservations that are approved but unpaid
        // These are reservations with status='PENDING' AND admin_ack=1
        List<Reservation> pendingPaymentReservations = reservationRepository.findByStatusAndAdminAck(
                ReservationStatus.PENDING, true);

        BigDecimal totalPendingFromReservations = pendingPaymentReservations.stream()
                .map(Reservation::getTotalAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // Combine both sources or use the reservation-based one
        BigDecimal totalPending = totalPendingFromReservations; // Use this if payments table doesn't have entries

        long totalReservations = reservationRepository.count();
        long totalVendors = userRepository.findByRoleAndActiveTrue(UserRole.VENDOR).size();

        // Pending RESERVATIONS (waiting for admin approval) - admin_ack = 0
        long pendingReservations = reservationRepository.countByStatusAndAdminAck(ReservationStatus.PENDING, false);

        // RECENT CANCELLATIONS
        LocalDateTime yesterday = LocalDateTime.now().minusHours(24);
        long recentCancellations = reservationRepository.countByStatusAndUpdatedAtAfter(
                ReservationStatus.CANCELLED, yesterday);

        var upcoming = eventRepository.findUpcomingEvents(LocalDateTime.now());
        Map<String, Object> nextEvent = upcoming.isEmpty() ? Map.of()
                : Map.<String, Object>of(
                "id", upcoming.get(0).getId(),
                "name", upcoming.get(0).getName(),
                "eventDate", upcoming.get(0).getEventDate().toString(),
                "location", upcoming.get(0).getLocation());

        var genres = reservationGenreRepository.countGenres();
        long totalGenreCount = genres.stream().mapToLong(g -> (long) g.get("count")).sum();
        List<Map<String, Object>> genreStats = genres.stream().map(g -> {
            long count = (long) g.get("count");
            double percent = totalGenreCount > 0 ? (count * 100.0 / totalGenreCount) : 0;
            return Map.<String, Object>of("name", g.get("name"), "count", count, "percent", percent);
        }).collect(Collectors.toList());

        return Map.of(
                "totalEvents", totalEvents,
                "totalPendingAmount", totalPendingFromReservations,  // Use this instead
                "totalReceivedAmount", totalReceived,
                "totalReservations", totalReservations,
                "totalVendors", totalVendors,
                "nextUpcomingEvent", nextEvent,
                "genreDistribution", genreStats,
                "pendingReservations", pendingReservations,
                "recentCancellations", recentCancellations);
    }

}
