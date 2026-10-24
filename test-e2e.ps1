$env:Path = [Environment]::GetEnvironmentVariable("Path", "Machine") + ";" + [Environment]::GetEnvironmentVariable("Path", "User")
Write-Output "============================================================"
Write-Output "STARTING END-TO-END INTEGRATION TEST"
Write-Output "============================================================"

# Helper function to wait for an endpoint to become reachable
function Wait-Endpoint($url, $maxSeconds = 12) {
  $start = [DateTime]::UtcNow
  while (([DateTime]::UtcNow - $start).TotalSeconds -lt $maxSeconds) {
    try {
      $resp = Invoke-RestMethod -Uri $url -Method Get -TimeoutSec 2 -ErrorAction Stop
      return $resp
    } catch {
      Start-Sleep -Milliseconds 600
    }
  }
  throw "Endpoint $url failed to respond within $maxSeconds seconds."
}

# 1. Start Python ML Microservice
Write-Output "`n[1/5] Starting Python FastAPI ML Service (Port 8000)..."
$mlProc = Start-Process python -ArgumentList "ml/service.py" -PassThru

try {
  # 2. Check ML Health
  Write-Output "`n[2/5] Waiting for Python ML Service http://127.0.0.1:8000/health..."
  $mlHealth = Wait-Endpoint "http://127.0.0.1:8000/health" 15
  Write-Output "      Status: $($mlHealth.status), Version: $($mlHealth.model_version), Model Loaded: $($mlHealth.model_loaded)"

  # 3. Start Next.js Web Application
  Write-Output "`n[3/5] Starting Next.js Production Server (Port 3000)..."
  $nextProc = Start-Process npm.cmd -ArgumentList "start" -PassThru

  # 4. Probe Next.js API Routes
  Write-Output "`n[4/5] Waiting for Next.js Server http://localhost:3000/api/health..."
  $nextHealth = Wait-Endpoint "http://localhost:3000/api/health" 15
  Write-Output "      /api/health -> Status: $($nextHealth.status), ML Connected: $($nextHealth.ml_service.connected)"

  $sampleTelemetry = @{
    latitude = 22.5448
    longitude = 88.3426
    hour = 14
    day_of_week = 6
    is_weekend = 1
    crowd_density = 65.0
    crime_rate = 0.28
    incident_count = 0
    police_distance = 0.8
    hospital_distance = 1.2
    weather_condition = 0
    temperature = 28.0
    rainfall = 0.0
    humidity = 60.0
    tourist_speed = 2.5
    dwell_time = 45
    lighting_condition = 0
    location_type = 0
  } | ConvertTo-Json

  $nextPredict = Invoke-RestMethod -Uri "http://localhost:3000/api/predict" -Method Post -Body $sampleTelemetry -ContentType "application/json" -TimeoutSec 5
  Write-Output "      /api/predict -> Risk: $($nextPredict.risk_label) (Level $($nextPredict.risk_level)), Confidence: $([math]::Round($nextPredict.confidence * 100, 1))%"
  Write-Output "      Probabilities: Low=$($nextPredict.probabilities.Low), Med=$($nextPredict.probabilities.Medium), High=$($nextPredict.probabilities.High)"
  Write-Output "      Source: $($nextPredict.source)"

  # 5. Probe Frontend Routes
  Write-Output "`n[5/5] Testing Frontend Pages..."
  $touristPage = Invoke-WebRequest -Uri "http://localhost:3000/tourist" -UseBasicParsing -TimeoutSec 5
  Write-Output "      /tourist -> HTTP $($touristPage.StatusCode)"

  $insightsPage = Invoke-WebRequest -Uri "http://localhost:3000/authority/insights" -UseBasicParsing -TimeoutSec 5
  Write-Output "      /authority/insights -> HTTP $($insightsPage.StatusCode)"

  Write-Output "`n============================================================"
  Write-Output "ALL INTEGRATION & E2E CHECKS PASSED SUCCESSFULLY!"
  Write-Output "============================================================"
} catch {
  Write-Error "Integration test failed: $_"
} finally {
  Write-Output "`nTearing down test services..."
  if ($nextProc -and -not $nextProc.HasExited) {
    Stop-Process -Id $nextProc.Id -Force -ErrorAction SilentlyContinue
  }
  Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
  if ($mlProc -and -not $mlProc.HasExited) {
    Stop-Process -Id $mlProc.Id -Force -ErrorAction SilentlyContinue
  }
  Get-Process python -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
  Write-Output "Cleanup complete."
}
