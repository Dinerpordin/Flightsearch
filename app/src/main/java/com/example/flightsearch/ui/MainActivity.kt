package com.example.flightsearch.ui

import android.content.Intent
import android.net.Uri
import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.unit.dp
import com.example.flightsearch.data.FlightRepository
import com.example.flightsearch.data.Prefs
import com.example.flightsearch.model.FlightItem
import com.example.flightsearch.model.RouteSegment
import com.example.flightsearch.network.TequilaService
import kotlinx.coroutines.launch
import java.time.LocalDate
import java.time.format.DateTimeFormatter

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent { MaterialTheme { FlightSearchScreen() } }
    }
}

@Composable
fun FlightSearchScreen() {
    val ctx = LocalContext.current
    val scope = rememberCoroutineScope()

    var origin by remember { mutableStateOf("LHR") }
    var destination by remember { mutableStateOf("DAC") }
    var dateFrom by remember { mutableStateOf(LocalDate.now().toString()) }
    var dateTo by remember { mutableStateOf("") }
    var adults by remember { mutableStateOf("1") }
    var children by remember { mutableStateOf("0") }
    var cabin by remember { mutableStateOf("M") }
    var maxStops by remember { mutableStateOf("1") }
    var sort by remember { mutableStateOf("price") }
    var offline by remember { mutableStateOf(true) }

    var results by remember { mutableStateOf<List<FlightItem>>(emptyList()) }
    var currency by remember { mutableStateOf("GBP") }
    var loading by remember { mutableStateOf(false) }
    var error by remember { mutableStateOf<String?>(null) }

    var showApiDialog by remember { mutableStateOf(false) }
    var apiKey by remember { mutableStateOf<String?>(null) }

    LaunchedEffect(Unit) {
        apiKey = Prefs.getApiKey(ctx)
        offline = Prefs.getOffline(ctx)
    }

    val service = remember { TequilaService.create { Prefs.getApiKey(ctx) } }
    val repo = remember { FlightRepository(ctx, service) }

    if (showApiDialog) {
        ApiKeyDialog(
            initial = apiKey.orEmpty(),
            onSave = { key ->
                scope.launch {
                    Prefs.setApiKey(ctx, key)
                    apiKey = key
                    showApiDialog = false
                }
            },
            onCancel = { showApiDialog = false }
        )
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Flight Search (Standalone)") },
                actions = {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Text("Offline", modifier = Modifier.padding(end = 8.dp))
                        Switch(checked = offline, onCheckedChange = {
                            offline = it
                            scope.launch { Prefs.setOffline(ctx, it) }
                        })
                        TextButton(onClick = { showApiDialog = true }) { Text("API Key") }
                    }
                }
            )
        }
    ) { padding ->
        Column(Modifier.padding(padding).padding(12.dp)) {
            Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                OutlinedTextField(value = origin, onValueChange = { origin = it }, label = { Text("From (IATA)") }, modifier = Modifier.weight(1f))
                OutlinedTextField(value = destination, onValueChange = { destination = it }, label = { Text("To (IATA)") }, modifier = Modifier.weight(1f))
            }
            Spacer(Modifier.height(8.dp))
            Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                OutlinedTextField(value = dateFrom, onValueChange = { dateFrom = it }, label = { Text("Depart (YYYY-MM-DD)") }, modifier = Modifier.weight(1f))
                OutlinedTextField(value = dateTo, onValueChange = { dateTo = it }, label = { Text("Return (optional)") }, modifier = Modifier.weight(1f))
            }
            Spacer(Modifier.height(8.dp))
            Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                OutlinedTextField(value = adults, onValueChange = { adults = it }, label = { Text("Adults") }, keyboardOptions = androidx.compose.ui.text.input.KeyboardOptions(keyboardType = KeyboardType.Number), modifier = Modifier.weight(1f))
                OutlinedTextField(value = children, onValueChange = { children = it }, label = { Text("Children") }, keyboardOptions = androidx.compose.ui.text.input.KeyboardOptions(keyboardType = KeyboardType.Number), modifier = Modifier.weight(1f))
                OutlinedTextField(value = cabin, onValueChange = { cabin = it }, label = { Text("Cabin M/W/C/F") }, modifier = Modifier.weight(1f))
                OutlinedTextField(value = maxStops, onValueChange = { maxStops = it }, label = { Text("Max stops") }, keyboardOptions = androidx.compose.ui.text.input.KeyboardOptions(keyboardType = KeyboardType.Number), modifier = Modifier.weight(1f))
            }
            Spacer(Modifier.height(8.dp))
            Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                OutlinedTextField(value = sort, onValueChange = { sort = it }, label = { Text("Sort price|duration|stops") }, modifier = Modifier.weight(1f))
                OutlinedTextField(value = currency, onValueChange = { currency = it }, label = { Text("Currency") }, modifier = Modifier.weight(1f))
            }
            Spacer(Modifier.height(12.dp))
            Button(enabled = !loading, onClick = {
                error = null
                loading = true
                val fmt = DateTimeFormatter.ofPattern("dd/MM/yyyy")
                fun convert(s: String): String = runCatching { LocalDate.parse(s).format(fmt) }.getOrElse { "" }
                val params = mapOf(
                    "fly_from" to origin.trim().uppercase(),
                    "fly_to" to destination.trim().uppercase(),
                    "date_from" to convert(dateFrom),
                    "date_to" to (if (dateTo.isBlank()) convert(dateFrom) else convert(dateTo)),
                    "adults" to adults.ifBlank { "1" },
                    "children" to children.ifBlank { "0" },
                    "curr" to currency,
                    "selected_cabins" to cabin.ifBlank { "M" },
                    "max_stopovers" to maxStops.ifBlank { "1" },
                    "limit" to "25",
                    "offset" to "0",
                    "sort" to if (sort in listOf("price","duration","stops")) if (sort=="price") "price" else "quality" else "price",
                    "locale" to "en-GB"
                )
                val coroutineScope = rememberCoroutineScope()
                coroutineScope.launch {
                    val res = FlightRepository(ctx, TequilaService.create { Prefs.getApiKey(ctx) }).search(params, offline = offline)
                    res.onSuccess { api -> results = api.data }.onFailure { t -> error = t.message ?: "Unknown error" }
                    loading = false
                }
            }) { Text(if (loading) "Searching..." else "Search flights") }

            Spacer(Modifier.height(16.dp))

            if (error != null) {
                Text("Error: $error", color = MaterialTheme.colorScheme.error)
            }

            LazyColumn(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                items(results) { item -> FlightCard(item = item, currency = currency) }
            }
        }
    }
}

@Composable
fun FlightCard(item: FlightItem, currency: String) {
    val ctx = LocalContext.current
    Card {
        Column(Modifier.padding(12.dp)) {
            Text(text = "Price: ${item.price ?: 0.0} $currency", style = MaterialTheme.typography.titleMedium)
            Text(text = "Duration: ${(item.duration?.total ?: 0)/60} min")
            Text(text = "Stops: ${kotlin.math.max(0, item.route.size - 1)}")
            Spacer(Modifier.height(8.dp))
            item.route.take(4).forEach { seg -> SegmentRow(seg) }
            Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.End) {
                TextButton(onClick = {
                    item.deepLink?.let { url ->
                        val intent = Intent(Intent.ACTION_VIEW, Uri.parse(url))
                        ctx.startActivity(intent)
                    }
                }) { Text("Book") }
            }
        }
    }
}

@Composable
fun SegmentRow(seg: RouteSegment) {
    Column(Modifier.padding(vertical = 2.dp)) {
        Text("${seg.airline ?: ""} ${seg.flightNo ?: ""} — ${(seg.cityFrom ?: seg.flyFrom) ?: ""} → ${(seg.cityTo ?: seg.flyTo) ?: ""}")
        Text("${seg.localDeparture ?: ""} → ${seg.localArrival ?: ""}", style = MaterialTheme.typography.bodySmall)
    }
}

@Composable
fun ApiKeyDialog(initial: String, onSave: (String) -> Unit, onCancel: () -> Unit) {
    var text by remember { mutableStateOf(initial) }
    AlertDialog(
        onDismissRequest = onCancel,
        confirmButton = { TextButton(onClick = { onSave(text) }) { Text("Save") } },
        dismissButton = { TextButton(onClick = onCancel) { Text("Cancel") } },
        title = { Text("Tequila API Key (optional)") },
        text = { Column { Text("Standalone works offline. Add a key to use live data when Offline is toggled off.") ; OutlinedTextField(value = text, onValueChange = { text = it }, label = { Text("API Key") }) } }
    )
}
