package com.raahim2.speedometer

import android.Manifest
import android.annotation.SuppressLint
import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.geometry.Size
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.StrokeCap
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.google.accompanist.permissions.ExperimentalPermissionsApi
import com.google.accompanist.permissions.PermissionStatus
import com.google.accompanist.permissions.rememberPermissionState
import com.google.android.gms.location.FusedLocationProviderClient
import com.google.android.gms.location.LocationServices
import com.google.android.gms.location.LocationCallback
import com.google.android.gms.location.LocationRequest
import com.google.android.gms.location.LocationResult
import com.raahim2.speedometer.ui.theme.SpeedometerTheme
import kotlin.math.roundToInt
import kotlin.math.sqrt
import androidx.compose.animation.core.*
import androidx.compose.foundation.background
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.text.style.TextAlign

val DarkBackground = Color(0xFF323437)
val AccentYellow = Color(0xFFE2B714)
val TextWhite = Color(0xFFE1E1E1)

class MainActivity : ComponentActivity() {
    private lateinit var fusedLocationClient: FusedLocationProviderClient

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        fusedLocationClient = LocationServices.getFusedLocationProviderClient(this)

        setContent {
            SpeedometerTheme {
                Surface(
                    modifier = Modifier.fillMaxSize(),
                    color = DarkBackground
                ) {
                    MainScreen(fusedLocationClient)
                }
            }
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class, ExperimentalPermissionsApi::class)
@SuppressLint("MissingPermission")
@Composable
fun MainScreen(fusedLocationClient: FusedLocationProviderClient) {
    val locationPermissionState = rememberPermissionState(Manifest.permission.ACCESS_FINE_LOCATION)
    var currentSpeed by remember { mutableStateOf(0.0) }
    var maxSpeed by remember { mutableStateOf(0.0) }
    var totalDistance by remember { mutableStateOf(0.0) }
    var previousLatLng by remember { mutableStateOf<Pair<Double, Double>?>(null) }
    var totalSpeed by remember { mutableStateOf(0.0) }
    var speedCount by remember { mutableStateOf(0) }

    LaunchedEffect(Unit) {
        if (locationPermissionState.status != PermissionStatus.Granted) {
            locationPermissionState.launchPermissionRequest()
        }
    }

    if (locationPermissionState.status == PermissionStatus.Granted) {
        val locationRequest = LocationRequest.create().apply {
            interval = 1000
            fastestInterval = 500
            priority = LocationRequest.PRIORITY_HIGH_ACCURACY
        }

        val locationCallback = object : LocationCallback() {
            override fun onLocationResult(locationResult: LocationResult) {
                locationResult.lastLocation?.let { location ->
                    val speedKmh = (location.speed * 3.6).roundToInt().toDouble()
                    currentSpeed = speedKmh
                    maxSpeed = maxOf(maxSpeed, speedKmh)
                    totalSpeed += speedKmh
                    speedCount++

                    val newLatLng = Pair(location.latitude, location.longitude)
                    previousLatLng?.let { prev ->
                        totalDistance += calculateDistance(prev, newLatLng)
                    }
                    previousLatLng = newLatLng
                }
            }
        }

        DisposableEffect(Unit) {
            fusedLocationClient.requestLocationUpdates(locationRequest, locationCallback, null)
            onDispose {
                fusedLocationClient.removeLocationUpdates(locationCallback)
            }
        }
    }

    val averageSpeed = if (speedCount > 0) totalSpeed / speedCount else 0.0

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Speedometer", color = TextWhite) },
                colors = TopAppBarDefaults.smallTopAppBarColors(containerColor = DarkBackground)
            )
        },
        containerColor = DarkBackground
    ) { padding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.SpaceAround
        ) {
            SpeedometerScreen(currentSpeed = currentSpeed.toFloat())
            StatsDisplay(
                averageSpeed = averageSpeed,
                maxSpeed = maxSpeed,
                distance = totalDistance
            )
        }
    }
}

@Composable
fun SpeedometerScreen(currentSpeed: Float, modifier: Modifier = Modifier) {
    val animatedSweep by animateFloatAsState(
        targetValue = (currentSpeed / 120) * 240,
        animationSpec = tween(1000, easing = FastOutSlowInEasing),
        label = "sweepAnimation"
    )

    val animatedSpeed by animateFloatAsState(
        targetValue = currentSpeed,
        animationSpec = tween(1000, easing = FastOutSlowInEasing),
        label = "speedAnimation"
    )

    Box(
        contentAlignment = Alignment.Center,
        modifier = modifier.fillMaxWidth()
    ) {
        Canvas(modifier = Modifier.size(300.dp)) {
            drawArc(
                brush = Brush.linearGradient(
                    colors = listOf(
                        AccentYellow.copy(alpha = 0.1f),
                        AccentYellow.copy(alpha = 0.2f)
                    )
                ),
                startAngle = 150f,
                sweepAngle = 240f,
                useCenter = false,
                style = Stroke(width = 32f, cap = StrokeCap.Round),
                size = Size(size.width, size.height)
            )

            drawArc(
                brush = Brush.sweepGradient(
                    listOf(
                        AccentYellow.copy(alpha = 0.8f),
                        AccentYellow
                    )
                ),
                startAngle = 150f,
                sweepAngle = animatedSweep,
                useCenter = false,
                style = Stroke(width = 32f, cap = StrokeCap.Round),
                size = Size(size.width, size.height)
            )
        }

        Column(horizontalAlignment = Alignment.CenterHorizontally) {
            Text(
                text = "%.0f".format(animatedSpeed),
                color = AccentYellow,
                fontSize = 84.sp,
                fontWeight = FontWeight.Bold
            )
            Text(
                text = "km/h",
                color = TextWhite.copy(alpha = 0.8f),
                fontSize = 20.sp,
                fontWeight = FontWeight.Medium
            )
        }
    }
}

@Composable
fun StatsDisplay(averageSpeed: Double, maxSpeed: Double, distance: Double) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = 24.dp),
        horizontalArrangement = Arrangement.SpaceEvenly
    ) {
        StatCard(title = "AVERAGE", value = "%.1f".format(averageSpeed), unit = "km/h")
        StatCard(title = "MAX", value = "%.1f".format(maxSpeed), unit = "km/h")
        StatCard(title = "DISTANCE", value = "%.2f".format(distance / 1000), unit = "km")
    }
}

@Composable
fun StatCard(title: String, value: String, unit: String) {
    Card(
        modifier = Modifier.width(110.dp),
        colors = CardDefaults.cardColors(
            containerColor = Color(0x44E2B714),
            contentColor = TextWhite
        ),
        shape = MaterialTheme.shapes.medium
    ) {
        Column(
            modifier = Modifier.padding(12.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Text(
                text = title,
                fontSize = 12.sp,
                fontWeight = FontWeight.Bold,
                letterSpacing = 1.sp
            )
            Spacer(Modifier.height(4.dp))
            Text(
                text = value,
                fontSize = 18.sp,
                fontWeight = FontWeight.Bold
            )
            Text(
                text = unit,
                fontSize = 10.sp,
                color = TextWhite.copy(alpha = 0.8f)
            )
        }
    }
}

fun calculateDistance(start: Pair<Double, Double>, end: Pair<Double, Double>): Double {
    val earthRadius = 6371000.0 // meters
    val dLat = Math.toRadians(end.first - start.first)
    val dLon = Math.toRadians(end.second - start.second)
    val lat1 = Math.toRadians(start.first)
    val lat2 = Math.toRadians(end.first)

    val a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2)
    val c = 2 * Math.atan2(sqrt(a), sqrt(1 - a))

    return earthRadius * c
}

@Preview(showBackground = true)
@Composable
fun SpeedometerPreview() {
    SpeedometerTheme {
        Surface(color = DarkBackground) {
            Column {
                SpeedometerScreen(currentSpeed = 0.0f)
                StatsDisplay(
                    averageSpeed = 0.0,
                    maxSpeed = 0.0,
                    distance = 0.0
                )
            }
        }
    }
}