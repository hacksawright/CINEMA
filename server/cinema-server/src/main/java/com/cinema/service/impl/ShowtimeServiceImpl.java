package com.cinema.service.impl;

import com.cinema.dto.ShowtimeDto;
import com.cinema.dto.ShowtimeDetailResponse;
import com.cinema.dto.SeatResponse; 
import com.cinema.exception.NotFoundException;
import com.cinema.model.Movie;
import com.cinema.model.Room;
import com.cinema.model.Seat;
import com.cinema.model.Showtime;
import com.cinema.model.Ticket;
import com.cinema.repository.MovieRepository;
import com.cinema.repository.RoomRepository;
import com.cinema.repository.ShowtimeRepository;
import com.cinema.repository.SeatRepository; 
import com.cinema.repository.TicketRepository; 
import com.cinema.service.ShowtimeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@Transactional
public class ShowtimeServiceImpl implements ShowtimeService {

    // Inject Repositories
    @Autowired
    private ShowtimeRepository showtimeRepository;
    @Autowired
    private MovieRepository movieRepository;
    @Autowired
    private RoomRepository roomRepository;
    @Autowired
    private SeatRepository seatRepository; 
    @Autowired
    private TicketRepository ticketRepository; 

    // Các trạng thái vé được coi là đã bị chiếm
    private static final List<String> BOOKED_STATUSES = List.of("BOOKED", "SOLD", "PROCESSING");

    @Override
    public ShowtimeDto create(ShowtimeDto dto) {
        Movie movie = movieRepository.findById(dto.getMovieId())
            .orElseThrow(() -> new NotFoundException("Movie not found: " + dto.getMovieId()));
        Room room = roomRepository.findById(dto.getRoomId())
            .orElseThrow(() -> new NotFoundException("Room not found: " + dto.getRoomId()));

        Showtime s = Showtime.builder()
            .movie(movie)
            .room(room)
            .startsAt(dto.getStartsAt())
            .endsAt(dto.getEndsAt())
            .basePrice(dto.getBasePrice())
            .build();

        s = showtimeRepository.save(s);
        return toDto(s);
    }
    
    @Override
    public ShowtimeDto update(Long id, ShowtimeDto dto) {
        Showtime s = showtimeRepository.findById(id).orElseThrow(() -> new NotFoundException("Showtime not found: " + id));
        if (dto.getMovieId() != null) {
            Movie movie = movieRepository.findById(dto.getMovieId())
                    .orElseThrow(() -> new NotFoundException("Movie not found: " + dto.getMovieId()));
            s.setMovie(movie);
        }
        if (dto.getRoomId() != null) {
            Room room = roomRepository.findById(dto.getRoomId())
                    .orElseThrow(() -> new NotFoundException("Room not found: " + dto.getRoomId()));
            s.setRoom(room);
        }
        if (dto.getStartsAt() != null) s.setStartsAt(dto.getStartsAt());
        if (dto.getEndsAt() != null) s.setEndsAt(dto.getEndsAt());
        if (dto.getBasePrice() != null) s.setBasePrice(dto.getBasePrice());

        s = showtimeRepository.save(s);
        return toDto(s);
    }

    @Override
    public ShowtimeDto getById(Long id) {
        return showtimeRepository.findById(id).map(this::toDto)
                .orElseThrow(() -> new NotFoundException("Showtime not found: " + id));
    }

    @Override
    public Page<ShowtimeDto> list(Pageable pageable) {
        Page<Showtime> p = showtimeRepository.findAll(pageable);
        return new PageImpl<>(p.stream().map(this::toDto).collect(Collectors.toList()), pageable, p.getTotalElements());
    }

    @Override
    public void delete(Long id) {
        if (!showtimeRepository.existsById(id)) throw new NotFoundException("Showtime not found: " + id);
        showtimeRepository.deleteById(id);
    }
    
    // ĐẢM BẢO PHƯƠNG THỨC NÀY CÓ TRONG INTERFACE ShowtimeService
    @Override
    @Transactional(readOnly = true)
    public ShowtimeDetailResponse getShowtimeDetails(Long showtimeId) {
        
        // 1. Lấy thông tin Suất chiếu và Phòng chiếu
        Showtime showtime = showtimeRepository.findById(showtimeId)
            .orElseThrow(() -> new NotFoundException("Suất chiếu không tồn tại: " + showtimeId));
        
        Room room = showtime.getRoom();
        
        // 2. Lấy TẤT CẢ ghế trong phòng
        List<Seat> allSeats = seatRepository.findByRoomId(room.getId());

        // 3. Lấy TẤT CẢ ID ghế đã bị chiếm
        Set<Ticket> bookedTickets = ticketRepository.findByShowtime_IdAndStatusIn(showtimeId, BOOKED_STATUSES);

        // 4. Chuyển đổi List<Ticket> thành Set<Long> (ID ghế đã bị chiếm)
        Set<Long> bookedSeatIds = bookedTickets.stream()
            .map(ticket -> ticket.getSeat().getId()) 
            .collect(Collectors.toSet());
            
        // 5. Ánh xạ tất cả ghế sang DTO và đánh dấu trạng thái
        Set<SeatResponse> seatResponses = allSeats.stream()
            .map(seat -> toSeatResponse(seat, bookedSeatIds)) // TRUYỀN THÊM bookedSeatIds
            .collect(Collectors.toSet());
            
        // 6. Trả về DTO tổng hợp
        return toShowtimeDetailResponse(showtime, room, seatResponses, bookedSeatIds);
    }

    // ====================================================================
    // HÀM CHUYỂN ĐỔI (Mappers)
    // ====================================================================

    private ShowtimeDto toDto(Showtime s) {
        return ShowtimeDto.builder()
            .id(s.getId())
            .movieId(s.getMovie() != null ? s.getMovie().getId() : null)
            .roomId(s.getRoom() != null ? s.getRoom().getId() : null)
            .startsAt(s.getStartsAt())
            .endsAt(s.getEndsAt())
            .basePrice(s.getBasePrice())
            .build();
    }
    
    // ĐÃ SỬA LỖI: Thêm tham số bookedSeatIds để xác định trạng thái ghế
    private SeatResponse toSeatResponse(Seat seat, Set<Long> bookedSeatIds) {
        // Giả sử SeatResponse DTO có constructor hoặc builder phù hợp
        return new SeatResponse(
            seat.getId(), 
            seat.getRowLabel(), 
            seat.getSeatNumber(), 
            seat.getType()
        );
    }

    // Giữ nguyên hàm này
    private ShowtimeDetailResponse toShowtimeDetailResponse(Showtime showtime, Room room, Set<SeatResponse> allSeats, Set<Long> bookedSeatIds) {
        return new ShowtimeDetailResponse(
            showtime.getId(),
            showtime.getMovie().getTitle(),
            showtime.getStartsAt(),
            room.getId(),
            room.getName(),
            room.getTotalRows(),
            room.getSeatsPerRow(),
            showtime.getBasePrice(),
            allSeats,
            bookedSeatIds
        );
    }
}