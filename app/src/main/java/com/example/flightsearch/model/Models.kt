package com.example.flightsearch.model

import com.squareup.moshi.Json

data class ApiResponse(
    @Json(name = "currency") val currency: String? = "GBP",
    @Json(name = "data") val data: List<FlightItem> = emptyList()
)

data class FlightItem(
    @Json(name = "price") val price: Double?,
    @Json(name = "duration") val duration: Duration?,
    @Json(name = "route") val route: List<RouteSegment> = emptyList(),
    @Json(name = "deep_link") val deepLink: String?
)

data class Duration(@Json(name = "total") val total: Int?)

data class RouteSegment(
    @Json(name = "airline") val airline: String?,
    @Json(name = "flight_no") val flightNo: Int?,
    @Json(name = "cityFrom") val cityFrom: String?,
    @Json(name = "cityTo") val cityTo: String?,
    @Json(name = "flyFrom") val flyFrom: String?,
    @Json(name = "flyTo") val flyTo: String?,
    @Json(name = "local_departure") val localDeparture: String?,
    @Json(name = "local_arrival") val localArrival: String?
)
