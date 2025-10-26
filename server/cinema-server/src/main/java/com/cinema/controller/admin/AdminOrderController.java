package com.cinema.controller.admin;

import com.cinema.dto.OrderDetailDTO;
import com.cinema.dto.OrderSummaryDTO;
import com.cinema.dto.UpdateOrderStatusDTO;
import com.cinema.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/orders")
@RequiredArgsConstructor
public class AdminOrderController {

    private final OrderService orderService;

    @GetMapping
    public ResponseEntity<List<OrderSummaryDTO>> getAllOrders() {
        List<OrderSummaryDTO> orders = orderService.getAllOrdersForAdmin();
        return ResponseEntity.ok(orders);
    }

    @GetMapping("/{orderId}")
    public ResponseEntity<OrderDetailDTO> getOrderDetails(@PathVariable Long orderId) {
        OrderDetailDTO orderDetail = orderService.getOrderDetail(orderId);
        return ResponseEntity.ok(orderDetail);
    }

    @PutMapping("/{orderId}/status")
    public ResponseEntity<OrderDetailDTO> updateOrderStatus(
            @PathVariable Long orderId,
            @Valid @RequestBody UpdateOrderStatusDTO statusUpdate) {
        OrderDetailDTO updatedOrder = orderService.updateOrderStatus(orderId, statusUpdate.getNewStatus());
        return ResponseEntity.ok(updatedOrder);
    }
}