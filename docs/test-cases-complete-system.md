# Test Cases - Complete System (350 Test Cases)

**Project:** Vietnamese Traffic Violation Detection System  
**Version:** 1.0  
**Date:** 2025-11-22  
**Total Test Cases:** 350

---

## Table of Contents

1. [License Plate Scanner - 70 Test Cases](#1-license-plate-scanner)
2. [Violation Checker - 50 Test Cases](#2-violation-checker)
3. [Dashboard - 40 Test Cases](#3-dashboard)
4. [Authentication System - 40 Test Cases](#4-authentication-system)
5. [Search History - 30 Test Cases](#5-search-history)
6. [Violation History - 30 Test Cases](#6-violation-history)
7. [Database & RLS Policies - 30 Test Cases](#7-database-rls-policies)
8. [Edge Functions - 25 Test Cases](#8-edge-functions)
9. [Map Integration - 20 Test Cases](#9-map-integration)
10. [Performance Testing - 15 Test Cases](#10-performance-testing)

---

## 1. License Plate Scanner

### 1.1 Camera Access (TC-LPS-001 to TC-LPS-010)

| Test Case ID | Test Case Name | Priority | Test Steps | Expected Result | Test Data |
|-------------|----------------|----------|------------|-----------------|-----------|
| TC-LPS-001 | Verify camera permission request on first access | High | 1. Navigate to scanner<br>2. Observe permission dialog | Browser shows camera permission request | N/A |
| TC-LPS-002 | Verify camera activation after permission granted | High | 1. Grant camera permission<br>2. Observe camera feed | Camera feed displays in preview area | N/A |
| TC-LPS-003 | Verify error handling for denied camera permission | High | 1. Deny camera permission<br>2. Observe error message | Clear error message displayed with retry option | N/A |
| TC-LPS-004 | Verify camera selection with multiple cameras | Medium | 1. Connect multiple cameras<br>2. Open camera selector<br>3. Select different camera | Selected camera feed displays correctly | Multiple cameras |
| TC-LPS-005 | Verify camera feed quality settings | Medium | 1. Access camera settings<br>2. Change resolution<br>3. Observe feed quality | Feed quality updates accordingly | N/A |
| TC-LPS-006 | Verify camera feed in different lighting conditions | High | 1. Use camera in bright light<br>2. Use camera in low light<br>3. Use camera with glare | Feed adjusts or shows appropriate warnings | Various lighting |
| TC-LPS-007 | Verify camera stop functionality | High | 1. Start camera<br>2. Click stop button<br>3. Observe camera feed | Camera feed stops, resources released | N/A |
| TC-LPS-008 | Verify camera restart after stop | Medium | 1. Stop camera<br>2. Click start again<br>3. Observe feed | Camera restarts successfully | N/A |
| TC-LPS-009 | Verify camera timeout handling | Medium | 1. Request camera access<br>2. Wait without responding<br>3. Observe timeout behavior | Appropriate timeout message displayed | N/A |
| TC-LPS-010 | Verify camera device not found error | Medium | 1. Access scanner without camera<br>2. Observe error handling | Clear error message about no camera found | No camera device |

### 1.2 Image Capture (TC-LPS-011 to TC-LPS-020)

| Test Case ID | Test Case Name | Priority | Test Steps | Expected Result | Test Data |
|-------------|----------------|----------|------------|-----------------|-----------|
| TC-LPS-011 | Verify manual capture from camera | High | 1. Start camera<br>2. Click capture button<br>3. Observe captured image | Image captured and displayed | N/A |
| TC-LPS-012 | Verify captured image quality | High | 1. Capture image<br>2. Check image resolution<br>3. Check image clarity | Image meets minimum quality standards | N/A |
| TC-LPS-013 | Verify retake functionality | High | 1. Capture image<br>2. Click retake<br>3. Observe camera feed | Returns to camera mode, previous image cleared | N/A |
| TC-LPS-014 | Verify image upload from device | High | 1. Click upload button<br>2. Select image file<br>3. Observe upload | Image uploads and displays correctly | JPG/PNG files |
| TC-LPS-015 | Verify invalid image format rejection | High | 1. Attempt to upload .gif/.bmp<br>2. Observe error | Error message for unsupported format | GIF, BMP files |
| TC-LPS-016 | Verify large image file handling | Medium | 1. Upload large image (>10MB)<br>2. Observe processing | Image resized or error shown for too large | 15MB image |
| TC-LPS-017 | Verify corrupted image file handling | Medium | 1. Upload corrupted image<br>2. Observe error handling | Clear error message displayed | Corrupted file |
| TC-LPS-018 | Verify image preview before processing | Medium | 1. Capture/upload image<br>2. Observe preview<br>3. Check controls | Image preview shown with process/retake options | N/A |
| TC-LPS-019 | Verify multiple image capture workflow | Low | 1. Capture image<br>2. Process<br>3. Capture another<br>4. Observe flow | Can capture multiple images sequentially | N/A |
| TC-LPS-020 | Verify image orientation handling | Medium | 1. Upload rotated image<br>2. Observe display<br>3. Check processing | Image displays in correct orientation | Rotated images |

### 1.3 CNN Recognition (TC-LPS-021 to TC-LPS-035)

| Test Case ID | Test Case Name | Priority | Test Steps | Expected Result | Test Data |
|-------------|----------------|----------|------------|-----------------|-----------|
| TC-LPS-021 | Verify CNN model loading | Critical | 1. Navigate to scanner<br>2. Observe model loading indicator<br>3. Wait for completion | CNN model loads successfully | N/A |
| TC-LPS-022 | Verify Vietnamese plate recognition (2-letter format) | Critical | 1. Upload plate image "30A-12345"<br>2. Process with CNN<br>3. Observe result | Correctly recognizes "30A-12345" | 30A-12345.jpg |
| TC-LPS-023 | Verify Vietnamese plate recognition (1-letter format) | Critical | 1. Upload plate image "51D-99999"<br>2. Process with CNN<br>3. Observe result | Correctly recognizes "51D-99999" | 51D-99999.jpg |
| TC-LPS-024 | Verify confidence score display | High | 1. Process clear plate image<br>2. Observe confidence score<br>3. Check percentage | Confidence score >85% displayed | Clear plate image |
| TC-LPS-025 | Verify low confidence warning | High | 1. Process blurry plate image<br>2. Observe confidence score<br>3. Check warning | Warning shown for confidence <70% | Blurry image |
| TC-LPS-026 | Verify processing time indicator | Medium | 1. Process image<br>2. Observe loading state<br>3. Check timing | Processing time <3 seconds displayed | N/A |
| TC-LPS-027 | Verify CNN with optimal lighting | High | 1. Process well-lit plate<br>2. Check recognition accuracy<br>3. Verify result | 95%+ accuracy for clear images | Well-lit plate |
| TC-LPS-028 | Verify CNN with poor lighting | High | 1. Process dark plate image<br>2. Check recognition result<br>3. Verify confidence | Lower confidence, possible failure warning | Dark plate image |
| TC-LPS-029 | Verify CNN with partial plate visibility | Medium | 1. Process partially obscured plate<br>2. Check recognition<br>3. Verify result | Error or low confidence warning | Partial plate |
| TC-LPS-030 | Verify CNN with dirty/damaged plate | Medium | 1. Process dirty plate image<br>2. Check recognition<br>3. Verify confidence score | Reduced confidence or error | Dirty plate image |
| TC-LPS-031 | Verify CNN error handling for invalid input | High | 1. Process non-plate image<br>2. Observe error handling<br>3. Check message | Clear error message displayed | Car image without plate |
| TC-LPS-032 | Verify CNN memory management | Medium | 1. Process 10 images consecutively<br>2. Monitor memory usage<br>3. Check for leaks | No memory leaks, stable performance | 10 test images |
| TC-LPS-033 | Verify CNN model caching | Low | 1. Process first image (cold start)<br>2. Process second image<br>3. Compare times | Second processing faster due to caching | 2 test images |
| TC-LPS-034 | Verify CNN with angled plate capture | Medium | 1. Process plate at 30° angle<br>2. Check recognition<br>3. Verify result | Handles moderate angles correctly | Angled plate |
| TC-LPS-035 | Verify CNN result format validation | High | 1. Process valid plate<br>2. Check output format<br>3. Verify structure | Result matches Vietnamese plate format | Valid plate image |

### 1.4 Manual Input (TC-LPS-036 to TC-LPS-045)

| Test Case ID | Test Case Name | Priority | Test Steps | Expected Result | Test Data |
|-------------|----------------|----------|------------|-----------------|-----------|
| TC-LPS-036 | Verify manual plate input field | High | 1. Navigate to manual input<br>2. Click input field<br>3. Type plate number | Input accepts alphanumeric characters | 30A-12345 |
| TC-LPS-037 | Verify plate format validation | Critical | 1. Enter invalid format "ABC123"<br>2. Attempt to submit<br>3. Observe validation | Error message for invalid format | ABC123 |
| TC-LPS-038 | Verify valid Vietnamese plate formats accepted | Critical | 1. Enter "30A-12345"<br>2. Submit<br>3. Verify acceptance | Valid format accepted and processed | 30A-12345 |
| TC-LPS-039 | Verify uppercase conversion | Medium | 1. Enter "30a-12345"<br>2. Observe input<br>3. Check conversion | Automatically converts to "30A-12345" | 30a-12345 |
| TC-LPS-040 | Verify special character handling | High | 1. Enter "30A@12345"<br>2. Attempt submit<br>3. Observe validation | Error for invalid special characters | 30A@12345 |
| TC-LPS-041 | Verify maximum length validation | Medium | 1. Enter >15 characters<br>2. Attempt submit<br>3. Observe validation | Error for exceeding max length | 30A-123456789012 |
| TC-LPS-042 | Verify minimum length validation | Medium | 1. Enter "30A"<br>2. Attempt submit<br>3. Observe validation | Error for insufficient length | 30A |
| TC-LPS-043 | Verify empty input validation | High | 1. Leave field empty<br>2. Attempt submit<br>3. Observe validation | Error message for required field | Empty |
| TC-LPS-044 | Verify manual input clear functionality | Medium | 1. Enter plate number<br>2. Click clear button<br>3. Observe field | Input field cleared | 30A-12345 |
| TC-LPS-045 | Verify manual input submit button state | Medium | 1. Observe disabled state<br>2. Enter valid plate<br>3. Observe enabled state | Button disabled until valid input | N/A |

### 1.5 Result Display (TC-LPS-046 to TC-LPS-055)

| Test Case ID | Test Case Name | Priority | Test Steps | Expected Result | Test Data |
|-------------|----------------|----------|------------|-----------------|-----------|
| TC-LPS-046 | Verify successful recognition result display | Critical | 1. Process valid plate<br>2. Observe result panel<br>3. Check all elements | Plate number, confidence, timestamp displayed | 30A-12345 |
| TC-LPS-047 | Verify confidence score visualization | High | 1. Process plate<br>2. Check confidence display<br>3. Verify color coding | Confidence shown with color (green >85%, yellow 70-85%, red <70%) | Various plates |
| TC-LPS-048 | Verify result timestamp accuracy | Medium | 1. Process plate<br>2. Check timestamp<br>3. Verify accuracy | Timestamp accurate to current time | N/A |
| TC-LPS-049 | Verify copy plate number functionality | Medium | 1. View result<br>2. Click copy button<br>3. Paste elsewhere | Plate number copied to clipboard | 30A-12345 |
| TC-LPS-050 | Verify result history in session | Low | 1. Scan multiple plates<br>2. View result history<br>3. Check chronology | All scans in session displayed chronologically | 3-4 plates |
| TC-LPS-051 | Verify violation check from results | High | 1. View scan result<br>2. Click check violations<br>3. Observe navigation | Navigates to violation checker with plate | 30A-12345 |
| TC-LPS-052 | Verify new scan from results | High | 1. View result<br>2. Click new scan button<br>3. Observe transition | Returns to camera/upload mode | N/A |
| TC-LPS-053 | Verify error result display | High | 1. Process unrecognizable image<br>2. Observe error result<br>3. Check options | Error message with retry/manual input options | Invalid image |
| TC-LPS-054 | Verify result sharing functionality | Low | 1. View result<br>2. Click share button<br>3. Check share options | Share dialog opens with options | 30A-12345 |
| TC-LPS-055 | Verify result persistence after refresh | Medium | 1. Scan plate<br>2. Refresh page<br>3. Check result availability | Result not persisted (session-based) | 30A-12345 |

### 1.6 Integration (TC-LPS-056 to TC-LPS-065)

| Test Case ID | Test Case Name | Priority | Test Steps | Expected Result | Test Data |
|-------------|----------------|----------|------------|-----------------|-----------|
| TC-LPS-056 | Verify database scan record creation | Critical | 1. Scan plate while authenticated<br>2. Check database<br>3. Verify record | Scan saved to license_plate_scans table | 30A-12345 |
| TC-LPS-057 | Verify scan without authentication | High | 1. Logout<br>2. Attempt to scan<br>3. Observe behavior | Redirected to login or limited functionality | N/A |
| TC-LPS-058 | Verify scan data completeness | High | 1. Perform scan<br>2. Check saved data<br>3. Verify fields | All fields (user_id, plate, confidence, timestamp) saved | 30A-12345 |
| TC-LPS-059 | Verify violation check integration | Critical | 1. Scan plate with violations<br>2. Observe violation alert<br>3. Check details | Violation alert displayed with count | 51D-99999 |
| TC-LPS-060 | Verify violation check integration (no violations) | High | 1. Scan clean plate<br>2. Observe result<br>3. Check message | "No violations" message displayed | 30A-12345 |
| TC-LPS-061 | Verify vehicle info panel integration | Medium | 1. Scan plate<br>2. View vehicle info panel<br>3. Check data | Mock vehicle data displayed | 30A-12345 |
| TC-LPS-062 | Verify edge function communication | High | 1. Use AI recognition mode<br>2. Process image<br>3. Check edge function call | Edge function called and response received | Test image |
| TC-LPS-063 | Verify RLS policy enforcement | Critical | 1. Login as User A<br>2. Scan plate<br>3. Login as User B<br>4. Check User A's scans | User B cannot see User A's scans | 30A-12345 |
| TC-LPS-064 | Verify concurrent scan handling | Medium | 1. Open multiple tabs<br>2. Scan in both tabs<br>3. Check database | Both scans saved independently | 2 plates |
| TC-LPS-065 | Verify scan limit enforcement | Low | 1. Perform 100 scans<br>2. Attempt 101st scan<br>3. Observe behavior | Rate limiting or quota message if implemented | N/A |

### 1.7 Usability & UI (TC-LPS-066 to TC-LPS-070)

| Test Case ID | Test Case Name | Priority | Test Steps | Expected Result | Test Data |
|-------------|----------------|----------|------------|-----------------|-----------|
| TC-LPS-066 | Verify responsive design on mobile | High | 1. Open scanner on mobile<br>2. Test all functions<br>3. Check layout | All features work, proper mobile layout | Mobile device |
| TC-LPS-067 | Verify responsive design on tablet | Medium | 1. Open scanner on tablet<br>2. Test all functions<br>3. Check layout | Optimized tablet layout | Tablet device |
| TC-LPS-068 | Verify loading states visibility | High | 1. Process image<br>2. Observe loading indicators<br>3. Check clarity | Clear loading indicators during processing | N/A |
| TC-LPS-069 | Verify accessibility (keyboard navigation) | Medium | 1. Use Tab key to navigate<br>2. Use Enter to activate<br>3. Check all controls | All controls accessible via keyboard | N/A |
| TC-LPS-070 | Verify help/tooltip availability | Low | 1. Hover over UI elements<br>2. Check for tooltips<br>3. Verify clarity | Helpful tooltips/instructions displayed | N/A |

---

## 2. Violation Checker

### 2.1 Search Functionality (TC-VC-001 to TC-VC-015)

| Test Case ID | Test Case Name | Priority | Test Steps | Expected Result | Test Data |
|-------------|----------------|----------|------------|-----------------|-----------|
| TC-VC-001 | Verify violation search with valid plate | Critical | 1. Enter "51D-99999"<br>2. Click search<br>3. Observe results | Violations displayed if exist | 51D-99999 |
| TC-VC-002 | Verify violation search with no violations | High | 1. Enter "30A-12345"<br>2. Click search<br>3. Observe result | "No violations found" message | 30A-12345 |
| TC-VC-003 | Verify search input validation | High | 1. Enter invalid format<br>2. Attempt search<br>3. Observe validation | Error message for invalid format | INVALID |
| TC-VC-004 | Verify case-insensitive search | Medium | 1. Enter "51d-99999"<br>2. Search<br>3. Check results | Results same as "51D-99999" | 51d-99999 |
| TC-VC-005 | Verify search with whitespace handling | Medium | 1. Enter " 51D-99999 "<br>2. Search<br>3. Check results | Whitespace trimmed, results correct | " 51D-99999 " |
| TC-VC-006 | Verify search loading state | High | 1. Click search<br>2. Observe UI during query<br>3. Check indicator | Loading spinner/indicator shown | 51D-99999 |
| TC-VC-007 | Verify search error handling | High | 1. Disconnect network<br>2. Attempt search<br>3. Observe error | Clear error message displayed | 51D-99999 |
| TC-VC-008 | Verify search retry after error | Medium | 1. Encounter search error<br>2. Click retry<br>3. Observe behavior | Search retries successfully | 51D-99999 |
| TC-VC-009 | Verify search history integration | High | 1. Perform search while authenticated<br>2. Check search history<br>3. Verify entry | Search saved to history | 51D-99999 |
| TC-VC-010 | Verify quick search from scan results | High | 1. Scan plate<br>2. Click "Check violations"<br>3. Verify auto-fill | Plate auto-filled in search | 30A-12345 |
| TC-VC-011 | Verify search clear functionality | Medium | 1. Enter plate<br>2. View results<br>3. Click clear<br>4. Observe | Results cleared, ready for new search | 51D-99999 |
| TC-VC-012 | Verify search without authentication | Medium | 1. Logout<br>2. Navigate to violation checker<br>3. Attempt search | Redirected to login or public search limited | N/A |
| TC-VC-013 | Verify multiple consecutive searches | Medium | 1. Search plate A<br>2. Search plate B<br>3. Search plate C<br>4. Check performance | All searches complete without issues | 3 plates |
| TC-VC-014 | Verify search result caching | Low | 1. Search plate<br>2. Search again immediately<br>3. Compare load time | Second search faster (cached) | 51D-99999 |
| TC-VC-015 | Verify search placeholder text | Low | 1. View search input<br>2. Check placeholder<br>3. Verify clarity | Clear example format shown | N/A |

### 2.2 Violation Display (TC-VC-016 to TC-VC-030)

| Test Case ID | Test Case Name | Priority | Test Steps | Expected Result | Test Data |
|-------------|----------------|----------|------------|-----------------|-----------|
| TC-VC-016 | Verify violation list display | Critical | 1. Search plate with violations<br>2. Observe list<br>3. Check completeness | All violations displayed with details | 51D-99999 |
| TC-VC-017 | Verify violation sorting by date | High | 1. View violations<br>2. Check order<br>3. Verify sorting | Most recent violations first | 51D-99999 |
| TC-VC-018 | Verify violation type display | High | 1. View violation<br>2. Check violation type<br>3. Verify clarity | Type clearly displayed (speeding, red light, etc.) | 51D-99999 |
| TC-VC-019 | Verify violation date formatting | Medium | 1. View violation<br>2. Check date format<br>3. Verify locale | Date in Vietnamese format (dd/MM/yyyy) | 51D-99999 |
| TC-VC-020 | Verify fine amount display | Critical | 1. View violation<br>2. Check fine amount<br>3. Verify currency | Amount in VND with proper formatting | 51D-99999 |
| TC-VC-021 | Verify violation location display | Medium | 1. View violation<br>2. Check location field<br>3. Verify clarity | Location shown if available | 51D-99999 |
| TC-VC-022 | Verify violation status indicator | High | 1. View violations<br>2. Check status badges<br>3. Verify colors | Status shown (Paid/Unpaid) with color coding | 51D-99999 |
| TC-VC-023 | Verify violation description display | Medium | 1. View violation<br>2. Check description<br>3. Verify details | Full description visible | 51D-99999 |
| TC-VC-024 | Verify total fines calculation | Critical | 1. View multiple violations<br>2. Check total<br>3. Verify sum | Total fines calculated correctly | 51D-99999 |
| TC-VC-025 | Verify unpaid fines calculation | High | 1. View violations<br>2. Check unpaid total<br>3. Verify accuracy | Unpaid fines summed correctly | 51D-99999 |
| TC-VC-026 | Verify violation count display | Medium | 1. View results<br>2. Check violation count<br>3. Verify accuracy | Count matches number of violations | 51D-99999 |
| TC-VC-027 | Verify empty state message | High | 1. Search plate with no violations<br>2. Observe empty state<br>3. Check message | Friendly "no violations" message | 30A-12345 |
| TC-VC-028 | Verify violation card layout | Medium | 1. View violation list<br>2. Check card design<br>3. Verify readability | Clean, readable card layout | 51D-99999 |
| TC-VC-029 | Verify violation expand/collapse | Low | 1. Click violation card<br>2. View expanded details<br>3. Collapse | Card expands to show more details | 51D-99999 |
| TC-VC-030 | Verify violation list pagination | Low | 1. Search plate with >20 violations<br>2. Observe pagination<br>3. Navigate pages | Pagination works correctly | Plate with many violations |

### 2.3 Violation Alert (TC-VC-031 to TC-VC-040)

| Test Case ID | Test Case Name | Priority | Test Steps | Expected Result | Test Data |
|-------------|----------------|----------|------------|-----------------|-----------|
| TC-VC-031 | Verify violation alert after scan | Critical | 1. Scan plate with violations<br>2. Observe alert<br>3. Check content | Alert displays violation count and total fines | 51D-99999 |
| TC-VC-032 | Verify alert for critical violations | High | 1. Scan plate with high fines<br>2. Observe alert level<br>3. Check styling | High-priority alert (red) for critical violations | High fine plate |
| TC-VC-033 | Verify alert for minor violations | Medium | 1. Scan plate with small fines<br>2. Observe alert level<br>3. Check styling | Warning alert (yellow) for minor violations | Low fine plate |
| TC-VC-034 | Verify alert dismiss functionality | Medium | 1. View violation alert<br>2. Click dismiss<br>3. Observe behavior | Alert dismissed, can be re-opened | 51D-99999 |
| TC-VC-035 | Verify alert action buttons | High | 1. View alert<br>2. Check action buttons<br>3. Click "View Details" | Navigates to full violation list | 51D-99999 |
| TC-VC-036 | Verify alert sound notification | Low | 1. Enable sound<br>2. Scan plate with violations<br>3. Observe audio | Sound plays on violation detection | 51D-99999 |
| TC-VC-037 | Verify alert visual prominence | High | 1. Trigger alert<br>2. Observe visibility<br>3. Check placement | Alert clearly visible, not easily missed | 51D-99999 |
| TC-VC-038 | Verify alert data accuracy | Critical | 1. View alert<br>2. Compare with database<br>3. Verify numbers | Alert data matches actual violations | 51D-99999 |
| TC-VC-039 | Verify alert persistence | Medium | 1. Trigger alert<br>2. Navigate away<br>3. Return<br>4. Check alert | Alert dismisses on navigation | 51D-99999 |
| TC-VC-040 | Verify alert accessibility | Medium | 1. Trigger alert<br>2. Use screen reader<br>3. Check announcement | Alert announced properly for accessibility | 51D-99999 |

### 2.4 Data Accuracy (TC-VC-041 to TC-VC-050)

| Test Case ID | Test Case Name | Priority | Test Steps | Expected Result | Test Data |
|-------------|----------------|----------|------------|-----------------|-----------|
| TC-VC-041 | Verify violation data source accuracy | Critical | 1. Check violations in database<br>2. Search via app<br>3. Compare data | App data matches database exactly | 51D-99999 |
| TC-VC-042 | Verify fine amount calculation | Critical | 1. View violations<br>2. Calculate total manually<br>3. Compare with app | Calculations are accurate | 51D-99999 |
| TC-VC-043 | Verify currency formatting | High | 1. View fine amounts<br>2. Check formatting<br>3. Verify locale | Proper VND formatting (1.500.000 ₫) | Various amounts |
| TC-VC-044 | Verify date/time accuracy | High | 1. View violation dates<br>2. Compare with database<br>3. Check timezone | Dates display in correct timezone | 51D-99999 |
| TC-VC-045 | Verify violation type mapping | High | 1. Check violation types in DB<br>2. View in app<br>3. Verify mapping | Types display correctly (Vietnamese names) | Various types |
| TC-VC-046 | Verify status update reflection | High | 1. Update violation status in DB<br>2. Refresh app<br>3. Verify update | Status changes reflected in app | Test violation |
| TC-VC-047 | Verify data refresh mechanism | Medium | 1. View violations<br>2. Update data externally<br>3. Refresh app<br>4. Verify | New data loads on refresh | 51D-99999 |
| TC-VC-048 | Verify null/missing field handling | High | 1. Create violation with null location<br>2. View in app<br>3. Check display | Null fields handled gracefully (N/A or empty) | Violation with nulls |
| TC-VC-049 | Verify large fine amount display | Medium | 1. View violation with >10M VND<br>2. Check formatting<br>3. Verify readability | Large amounts formatted properly | 50,000,000 VND |
| TC-VC-050 | Verify data consistency across views | High | 1. View violation in list<br>2. View in details<br>3. View in alert<br>4. Compare | Data consistent across all views | 51D-99999 |

---

## 3. Dashboard

### 3.1 Dashboard Access (TC-DB-001 to TC-DB-005)

| Test Case ID | Test Case Name | Priority | Test Steps | Expected Result | Test Data |
|-------------|----------------|----------|------------|-----------------|-----------|
| TC-DB-001 | Verify dashboard authentication requirement | Critical | 1. Logout<br>2. Navigate to /dashboard<br>3. Observe behavior | Redirected to login page | N/A |
| TC-DB-002 | Verify dashboard access after login | Critical | 1. Login<br>2. Navigate to /dashboard<br>3. Observe load | Dashboard loads successfully | Valid credentials |
| TC-DB-003 | Verify dashboard initial load performance | High | 1. Navigate to dashboard<br>2. Measure load time<br>3. Check performance | Dashboard loads within 3 seconds | N/A |
| TC-DB-004 | Verify dashboard navigation from menu | High | 1. Click dashboard in navbar<br>2. Observe navigation<br>3. Check URL | Navigates to /dashboard correctly | N/A |
| TC-DB-005 | Verify dashboard breadcrumb navigation | Medium | 1. Navigate to dashboard<br>2. Check breadcrumb<br>3. Verify links | Breadcrumb shows correct path | N/A |

### 3.2 Statistics Display (TC-DB-006 to TC-DB-015)

| Test Case ID | Test Case Name | Priority | Test Steps | Expected Result | Test Data |
|-------------|----------------|----------|------------|-----------------|-----------|
| TC-DB-006 | Verify total scans statistic | Critical | 1. View dashboard<br>2. Check total scans card<br>3. Verify count | Shows correct number of user's scans | User with 5 scans |
| TC-DB-007 | Verify total violations statistic | Critical | 1. View dashboard<br>2. Check total violations<br>3. Verify count | Shows correct violation count from searches | User with search history |
| TC-DB-008 | Verify recent activity count | High | 1. View dashboard<br>2. Check recent activity number<br>3. Verify accuracy | Shows recent scans/searches count | User with recent activity |
| TC-DB-009 | Verify statistic card layout | Medium | 1. View dashboard<br>2. Check stat cards<br>3. Verify design | Clean, readable card design | N/A |
| TC-DB-010 | Verify statistic icons | Low | 1. View stat cards<br>2. Check icons<br>3. Verify relevance | Appropriate icons for each statistic | N/A |
| TC-DB-011 | Verify statistic percentage changes | Medium | 1. View stats<br>2. Check trend indicators<br>3. Verify calculations | Trend arrows/percentages accurate | User with historical data |
| TC-DB-012 | Verify statistic hover tooltips | Low | 1. Hover over stat cards<br>2. Check tooltips<br>3. Verify info | Tooltips provide additional context | N/A |
| TC-DB-013 | Verify zero state for new users | High | 1. Login with new account<br>2. View dashboard<br>3. Check stats | Shows "0" or empty state appropriately | New user |
| TC-DB-014 | Verify statistic refresh | Medium | 1. Perform scan<br>2. Return to dashboard<br>3. Check updated stats | Stats refresh to show new data | N/A |
| TC-DB-015 | Verify statistic data accuracy | Critical | 1. Query database for user data<br>2. Compare with dashboard<br>3. Verify match | Dashboard stats match database | Test user |

### 3.3 Charts & Visualization (TC-DB-016 to TC-DB-025)

| Test Case ID | Test Case Name | Priority | Test Steps | Expected Result | Test Data |
|-------------|----------------|----------|------------|-----------------|-----------|
| TC-DB-016 | Verify scan activity chart display | High | 1. View dashboard<br>2. Locate activity chart<br>3. Check rendering | Chart renders correctly with data | User with scan history |
| TC-DB-017 | Verify chart data accuracy | Critical | 1. Check database scan dates<br>2. Compare with chart<br>3. Verify alignment | Chart data matches database records | User with 10+ scans |
| TC-DB-018 | Verify chart time period selection | High | 1. Click time period dropdown<br>2. Select different periods<br>3. Observe chart update | Chart updates for selected period | User with long history |
| TC-DB-019 | Verify chart responsiveness | Medium | 1. Resize window<br>2. Observe chart<br>3. Check on mobile | Chart adapts to different screen sizes | N/A |
| TC-DB-020 | Verify chart tooltip on hover | Medium | 1. Hover over chart data points<br>2. Check tooltip<br>3. Verify data | Tooltip shows detailed information | User with data |
| TC-DB-021 | Verify chart legend display | Low | 1. View chart<br>2. Check legend<br>3. Verify clarity | Legend clearly explains chart elements | N/A |
| TC-DB-022 | Verify chart empty state | High | 1. Login with new user<br>2. View chart<br>3. Check empty state | Empty state message shown | New user |
| TC-DB-023 | Verify chart animation | Low | 1. Navigate to dashboard<br>2. Observe chart load<br>3. Check animation | Smooth animation on load | N/A |
| TC-DB-024 | Verify chart color scheme | Medium | 1. View chart<br>2. Check colors<br>3. Verify accessibility | Colors meet accessibility standards | N/A |
| TC-DB-025 | Verify chart export functionality | Low | 1. View chart<br>2. Click export<br>3. Download image | Chart exports as image | User with data |

### 3.4 Recent Activity (TC-DB-026 to TC-DB-035)

| Test Case ID | Test Case Name | Priority | Test Steps | Expected Result | Test Data |
|-------------|----------------|----------|------------|-----------------|-----------|
| TC-DB-026 | Verify recent scans list | High | 1. View dashboard<br>2. Check recent scans section<br>3. Verify content | Shows latest 5-10 scans | User with scans |
| TC-DB-027 | Verify recent activity sorting | High | 1. View recent activity<br>2. Check order<br>3. Verify chronology | Most recent first | User with activity |
| TC-DB-028 | Verify activity timestamp display | Medium | 1. View recent activity<br>2. Check timestamps<br>3. Verify format | Relative time (e.g., "2 hours ago") | Recent activity |
| TC-DB-029 | Verify activity plate number display | High | 1. View recent scans<br>2. Check plate numbers<br>3. Verify accuracy | Plate numbers displayed correctly | User with scans |
| TC-DB-030 | Verify activity confidence display | Medium | 1. View recent scans<br>2. Check confidence scores<br>3. Verify formatting | Confidence shown as percentage | User with scans |
| TC-DB-031 | Verify activity click-through | High | 1. Click on recent activity item<br>2. Observe navigation<br>3. Check destination | Navigates to detailed view | User with activity |
| TC-DB-032 | Verify activity empty state | High | 1. Login with new user<br>2. View recent activity<br>3. Check message | "No recent activity" message shown | New user |
| TC-DB-033 | Verify activity list pagination | Medium | 1. Generate >20 activities<br>2. View dashboard<br>3. Check pagination | Shows pagination or "View All" link | User with many activities |
| TC-DB-034 | Verify activity violation indicators | High | 1. View recent scans<br>2. Check violation badges<br>3. Verify accuracy | Violations indicated with badge/icon | User with violation scans |
| TC-DB-035 | Verify activity refresh | Medium | 1. Perform new scan<br>2. Return to dashboard<br>3. Check recent activity | New activity appears in list | N/A |

### 3.5 Quick Actions (TC-DB-036 to TC-DB-040)

| Test Case ID | Test Case Name | Priority | Test Steps | Expected Result | Test Data |
|-------------|----------------|----------|------------|-----------------|-----------|
| TC-DB-036 | Verify quick scan button | High | 1. Click "New Scan" from dashboard<br>2. Observe navigation<br>3. Check destination | Navigates to scanner page | N/A |
| TC-DB-037 | Verify quick violation check button | High | 1. Click "Check Violations"<br>2. Observe navigation<br>3. Check destination | Navigates to violation checker | N/A |
| TC-DB-038 | Verify view history button | Medium | 1. Click "View History"<br>2. Observe navigation<br>3. Check destination | Navigates to full history page | N/A |
| TC-DB-039 | Verify quick action button layout | Medium | 1. View dashboard<br>2. Check quick actions<br>3. Verify visibility | Actions clearly visible and accessible | N/A |
| TC-DB-040 | Verify quick actions on mobile | High | 1. View dashboard on mobile<br>2. Check quick actions<br>3. Test functionality | Actions work correctly on mobile | Mobile device |

---

## 4. Authentication System

### 4.1 Login (TC-AUTH-001 to TC-AUTH-010)

| Test Case ID | Test Case Name | Priority | Test Steps | Expected Result | Test Data |
|-------------|----------------|----------|------------|-----------------|-----------|
| TC-AUTH-001 | Verify login with valid credentials | Critical | 1. Enter valid email<br>2. Enter valid password<br>3. Click login<br>4. Observe | Successfully logged in, redirected to dashboard | test@example.com / Pass123! |
| TC-AUTH-002 | Verify login with invalid email | High | 1. Enter invalid email<br>2. Enter password<br>3. Attempt login<br>4. Observe | Error message: "Invalid credentials" | invalid@test.com / Pass123! |
| TC-AUTH-003 | Verify login with invalid password | High | 1. Enter valid email<br>2. Enter wrong password<br>3. Attempt login<br>4. Observe | Error message: "Invalid credentials" | test@example.com / WrongPass |
| TC-AUTH-004 | Verify login with empty fields | High | 1. Leave email empty<br>2. Leave password empty<br>3. Attempt login<br>4. Observe | Validation errors for both fields | Empty |
| TC-AUTH-005 | Verify login email validation | Medium | 1. Enter invalid email format<br>2. Attempt to submit<br>3. Observe validation | Error: "Invalid email format" | notanemail |
| TC-AUTH-006 | Verify login password visibility toggle | Medium | 1. Enter password<br>2. Click show/hide icon<br>3. Observe | Password visibility toggles | Pass123! |
| TC-AUTH-007 | Verify login remember me functionality | Low | 1. Check "Remember me"<br>2. Login<br>3. Close browser<br>4. Reopen | User remains logged in | test@example.com |
| TC-AUTH-008 | Verify login loading state | Medium | 1. Click login<br>2. Observe UI during authentication<br>3. Check indicator | Loading spinner shown during authentication | Valid credentials |
| TC-AUTH-009 | Verify login rate limiting | Medium | 1. Attempt login 10 times with wrong password<br>2. Check for rate limit<br>3. Observe | Account temporarily locked or rate limited | test@example.com |
| TC-AUTH-010 | Verify login redirect after authentication | High | 1. Navigate to protected page<br>2. Get redirected to login<br>3. Login successfully<br>4. Observe | Redirected to originally requested page | N/A |

### 4.2 Signup (TC-AUTH-011 to TC-AUTH-020)

| Test Case ID | Test Case Name | Priority | Test Steps | Expected Result | Test Data |
|-------------|----------------|----------|------------|-----------------|-----------|
| TC-AUTH-011 | Verify signup with valid data | Critical | 1. Enter valid email<br>2. Enter strong password<br>3. Confirm password<br>4. Submit | Account created, auto-logged in | newuser@test.com |
| TC-AUTH-012 | Verify signup email validation | High | 1. Enter invalid email<br>2. Attempt signup<br>3. Observe validation | Error: "Invalid email format" | notanemail |
| TC-AUTH-013 | Verify signup password strength requirements | High | 1. Enter weak password<br>2. Attempt signup<br>3. Observe validation | Error: "Password must be at least 8 characters" | 123 |
| TC-AUTH-014 | Verify signup password confirmation | High | 1. Enter password<br>2. Enter different confirmation<br>3. Attempt signup<br>4. Observe | Error: "Passwords do not match" | Pass123! / Pass456! |
| TC-AUTH-015 | Verify signup with existing email | High | 1. Enter already registered email<br>2. Attempt signup<br>3. Observe error | Error: "Email already in use" | existing@test.com |
| TC-AUTH-016 | Verify signup email auto-confirmation | Critical | 1. Complete signup<br>2. Check email verification status<br>3. Verify auto-confirm | Email auto-confirmed, no verification needed | newuser2@test.com |
| TC-AUTH-017 | Verify signup form validation | Medium | 1. Submit empty form<br>2. Observe validation<br>3. Check all fields | All required fields show validation errors | Empty |
| TC-AUTH-018 | Verify signup loading state | Medium | 1. Click signup<br>2. Observe UI during process<br>3. Check indicator | Loading spinner shown | Valid data |
| TC-AUTH-019 | Verify signup success message | Medium | 1. Complete signup<br>2. Observe success state<br>3. Check message | Success message displayed | newuser3@test.com |
| TC-AUTH-020 | Verify signup navigation to login | Medium | 1. View signup page<br>2. Click "Already have account?"<br>3. Observe | Navigates to login page | N/A |

### 4.3 Logout (TC-AUTH-021 to TC-AUTH-025)

| Test Case ID | Test Case Name | Priority | Test Steps | Expected Result | Test Data |
|-------------|----------------|----------|------------|-----------------|-----------|
| TC-AUTH-021 | Verify logout functionality | Critical | 1. Login<br>2. Click logout<br>3. Observe behavior | Logged out, redirected to login page | Valid user |
| TC-AUTH-022 | Verify session clearing on logout | Critical | 1. Login<br>2. Logout<br>3. Press browser back<br>4. Observe | Cannot access protected pages | Valid user |
| TC-AUTH-023 | Verify logout from multiple tabs | High | 1. Login in 2 tabs<br>2. Logout from tab 1<br>3. Check tab 2<br>4. Observe | Tab 2 also logged out | Valid user |
| TC-AUTH-024 | Verify logout confirmation dialog | Low | 1. Click logout<br>2. Observe dialog<br>3. Confirm/cancel | Optional confirmation dialog shown | N/A |
| TC-AUTH-025 | Verify logout loading state | Low | 1. Click logout<br>2. Observe UI<br>3. Check indicator | Brief loading state during logout | Valid user |

### 4.4 Password Reset (TC-AUTH-026 to TC-AUTH-030)

| Test Case ID | Test Case Name | Priority | Test Steps | Expected Result | Test Data |
|-------------|----------------|----------|------------|-----------------|-----------|
| TC-AUTH-026 | Verify password reset request | High | 1. Click "Forgot password?"<br>2. Enter email<br>3. Submit<br>4. Observe | Reset email sent confirmation | test@example.com |
| TC-AUTH-027 | Verify reset email validation | Medium | 1. Enter invalid email<br>2. Attempt reset<br>3. Observe validation | Error: "Invalid email format" | notanemail |
| TC-AUTH-028 | Verify reset with non-existent email | Medium | 1. Enter unregistered email<br>2. Submit reset<br>3. Observe | Generic success message (security) | nonexistent@test.com |
| TC-AUTH-029 | Verify password reset token expiration | High | 1. Request reset<br>2. Wait >1 hour<br>3. Use link<br>4. Observe | Error: "Reset link expired" | test@example.com |
| TC-AUTH-030 | Verify password reset completion | High | 1. Use reset link<br>2. Enter new password<br>3. Confirm password<br>4. Submit | Password updated, can login with new password | NewPass123! |

### 4.5 Session Management (TC-AUTH-031 to TC-AUTH-040)

| Test Case ID | Test Case Name | Priority | Test Steps | Expected Result | Test Data |
|-------------|----------------|----------|------------|-----------------|-----------|
| TC-AUTH-031 | Verify session persistence | High | 1. Login<br>2. Close browser<br>3. Reopen<br>4. Check session | User still logged in (if remember me) | Valid user |
| TC-AUTH-032 | Verify session timeout | High | 1. Login<br>2. Idle for configured timeout<br>3. Attempt action<br>4. Observe | Session expired, redirected to login | Valid user |
| TC-AUTH-033 | Verify session refresh mechanism | Medium | 1. Login<br>2. Use app continuously<br>3. Monitor session<br>4. Check | Session refreshes automatically | Valid user |
| TC-AUTH-034 | Verify concurrent session handling | Medium | 1. Login on device A<br>2. Login on device B<br>3. Use both<br>4. Observe | Both sessions work independently | Valid user |
| TC-AUTH-035 | Verify session security (JWT) | Critical | 1. Login<br>2. Inspect JWT token<br>3. Verify signature<br>4. Check claims | JWT properly signed and validated | Valid user |
| TC-AUTH-036 | Verify session hijacking prevention | Critical | 1. Capture session token<br>2. Attempt use from different browser<br>3. Observe | Additional security checks or rejection | Valid user |
| TC-AUTH-037 | Verify logout clears session | Critical | 1. Login<br>2. Note session token<br>3. Logout<br>4. Reuse token | Old token invalid after logout | Valid user |
| TC-AUTH-038 | Verify session data integrity | High | 1. Login<br>2. Check user data in session<br>3. Verify accuracy | Correct user_id and metadata in session | Valid user |
| TC-AUTH-039 | Verify protected route access | Critical | 1. Logout<br>2. Navigate to /dashboard<br>3. Observe | Redirected to login page | N/A |
| TC-AUTH-040 | Verify session restoration after network failure | Medium | 1. Login<br>2. Disconnect network briefly<br>3. Reconnect<br>4. Observe | Session restored automatically | Valid user |

---

## 5. Search History

### 5.1 History Recording (TC-SH-001 to TC-SH-010)

| Test Case ID | Test Case Name | Priority | Test Steps | Expected Result | Test Data |
|-------------|----------------|----------|------------|-----------------|-----------|
| TC-SH-001 | Verify search history saving | Critical | 1. Login<br>2. Search plate<br>3. Check database<br>4. Verify record | Search saved to license_plate_search_history | 30A-12345 |
| TC-SH-002 | Verify scan history saving | Critical | 1. Login<br>2. Scan plate<br>3. Check database<br>4. Verify record | Scan saved to license_plate_scans | 51D-99999 |
| TC-SH-003 | Verify history timestamp accuracy | High | 1. Perform search<br>2. Check timestamp<br>3. Verify accuracy | Timestamp accurate to current time | 30A-12345 |
| TC-SH-004 | Verify history user association | Critical | 1. Login as User A<br>2. Search plate<br>3. Check database<br>4. Verify user_id | Record associated with correct user_id | Test user |
| TC-SH-005 | Verify duplicate history handling | Medium | 1. Search same plate twice<br>2. Check history<br>3. Verify records | Both searches recorded separately | 30A-12345 (x2) |
| TC-SH-006 | Verify history saving without authentication | High | 1. Logout<br>2. Attempt search<br>3. Check database<br>4. Verify | No history saved without auth | N/A |
| TC-SH-007 | Verify history plate number normalization | Medium | 1. Search "30a-12345"<br>2. Check saved value<br>3. Verify format | Saved as "30A-12345" (uppercase) | 30a-12345 |
| TC-SH-008 | Verify history with special characters | Medium | 1. Search valid plate with dash<br>2. Check saved value<br>3. Verify format | Dash preserved in saved value | 30A-12345 |
| TC-SH-009 | Verify concurrent history saves | Medium | 1. Open 2 tabs<br>2. Search different plates<br>3. Check database<br>4. Verify | Both searches saved independently | 2 different plates |
| TC-SH-010 | Verify history save error handling | Medium | 1. Disconnect database<br>2. Attempt search<br>3. Observe<br>4. Check | Search works, history save fails gracefully | 30A-12345 |

### 5.2 History Display (TC-SH-011 to TC-SH-020)

| Test Case ID | Test Case Name | Priority | Test Steps | Expected Result | Test Data |
|-------------|----------------|----------|------------|-----------------|-----------|
| TC-SH-011 | Verify search history list display | High | 1. Navigate to history<br>2. Observe list<br>3. Check completeness | All user's searches displayed | User with searches |
| TC-SH-012 | Verify history sorting by date | High | 1. View history<br>2. Check order<br>3. Verify chronology | Most recent first | User with history |
| TC-SH-013 | Verify history plate number display | High | 1. View history item<br>2. Check plate number<br>3. Verify accuracy | Plate number displayed correctly | User with history |
| TC-SH-014 | Verify history timestamp display | Medium | 1. View history item<br>2. Check timestamp<br>3. Verify format | Relative or absolute time shown | User with history |
| TC-SH-015 | Verify history empty state | High | 1. Login with new user<br>2. View history<br>3. Check message | "No search history" message shown | New user |
| TC-SH-016 | Verify history list pagination | Medium | 1. Generate 50+ searches<br>2. View history<br>3. Check pagination | Pagination or infinite scroll works | User with many searches |
| TC-SH-017 | Verify history item click action | High | 1. Click history item<br>2. Observe behavior<br>3. Check result | Re-searches the plate or fills search field | User with history |
| TC-SH-018 | Verify history RLS enforcement | Critical | 1. Login as User A<br>2. View history<br>3. Check contents<br>4. Verify | Only User A's history visible | Multiple users |
| TC-SH-019 | Verify history refresh | Medium | 1. View history<br>2. Perform new search<br>3. Refresh history<br>4. Check | New search appears in history | N/A |
| TC-SH-020 | Verify history search/filter | Low | 1. View history<br>2. Use search filter<br>3. Enter plate<br>4. Observe | History filtered by search term | User with many searches |

### 5.3 History Management (TC-SH-021 to TC-SH-030)

| Test Case ID | Test Case Name | Priority | Test Steps | Expected Result | Test Data |
|-------------|----------------|----------|------------|-----------------|-----------|
| TC-SH-021 | Verify individual history delete | High | 1. View history<br>2. Click delete on item<br>3. Confirm<br>4. Observe | Item deleted from history | User with history |
| TC-SH-022 | Verify delete confirmation dialog | Medium | 1. Click delete<br>2. Observe dialog<br>3. Click cancel<br>4. Verify | Confirmation shown, cancel works | User with history |
| TC-SH-023 | Verify clear all history | Medium | 1. View history<br>2. Click "Clear All"<br>3. Confirm<br>4. Observe | All history deleted | User with history |
| TC-SH-024 | Verify history delete RLS | Critical | 1. Login as User A<br>2. Attempt to delete User B's history<br>3. Observe | Cannot delete other user's history | Multiple users |
| TC-SH-025 | Verify history auto-cleanup | Low | 1. Create history >90 days old<br>2. Wait for cleanup<br>3. Check database<br>4. Verify | Old history auto-deleted (if implemented) | Old records |
| TC-SH-026 | Verify history export | Low | 1. View history<br>2. Click export<br>3. Download<br>4. Verify | History exported as CSV/JSON | User with history |
| TC-SH-027 | Verify history limit enforcement | Low | 1. Create 1000+ history entries<br>2. View history<br>3. Check limit<br>4. Verify | Only recent X entries shown | User with many entries |
| TC-SH-028 | Verify bulk history delete | Medium | 1. Select multiple items<br>2. Click bulk delete<br>3. Confirm<br>4. Observe | Selected items deleted | User with history |
| TC-SH-029 | Verify history restore after accidental delete | Low | 1. Delete item<br>2. Click undo (if available)<br>3. Observe | Item restored | User with history |
| TC-SH-030 | Verify history privacy mode | Low | 1. Enable private browsing<br>2. Perform searches<br>3. Check history<br>4. Verify | Searches not saved in private mode (if implemented) | N/A |

---

## 6. Violation History

### 6.1 Violation Recording (TC-VH-001 to TC-VH-010)

| Test Case ID | Test Case Name | Priority | Test Steps | Expected Result | Test Data |
|-------------|----------------|----------|------------|-----------------|-----------|
| TC-VH-001 | Verify violation creation in database | Critical | 1. Insert violation via SQL<br>2. Check database<br>3. Verify record | Violation saved correctly | Test violation data |
| TC-VH-002 | Verify violation required fields | Critical | 1. Attempt to insert violation missing required field<br>2. Observe error | Error for missing required fields | Incomplete data |
| TC-VH-003 | Verify violation date validation | High | 1. Insert violation with future date<br>2. Check if allowed<br>3. Verify behavior | Future dates rejected or flagged | Future date |
| TC-VH-004 | Verify violation fine amount validation | High | 1. Insert violation with negative fine<br>2. Check validation<br>3. Verify | Negative amounts rejected | -1000000 VND |
| TC-VH-005 | Verify violation status default | Medium | 1. Insert violation without status<br>2. Check database<br>3. Verify default | Default status is "unpaid" | Violation without status |
| TC-VH-006 | Verify violation plate number format | High | 1. Insert violation with invalid plate<br>2. Check validation<br>3. Observe | Invalid formats rejected or normalized | INVALID123 |
| TC-VH-007 | Verify violation type validation | Medium | 1. Insert violation with custom type<br>2. Check database<br>3. Verify | Type saved as provided | Custom violation type |
| TC-VH-008 | Verify violation timestamp accuracy | High | 1. Insert violation<br>2. Check created_at timestamp<br>3. Verify | Timestamp accurate to insertion time | Test violation |
| TC-VH-009 | Verify violation with null optional fields | Medium | 1. Insert violation with null description/location<br>2. Check database<br>3. Verify | Null values allowed for optional fields | Violation with nulls |
| TC-VH-010 | Verify bulk violation insert | Medium | 1. Insert 100 violations<br>2. Check database<br>3. Verify all | All violations inserted correctly | 100 test violations |

### 6.2 Violation Retrieval (TC-VH-011 to TC-VH-020)

| Test Case ID | Test Case Name | Priority | Test Steps | Expected Result | Test Data |
|-------------|----------------|----------|------------|-----------------|-----------|
| TC-VH-011 | Verify violation query by plate number | Critical | 1. Query violations for plate<br>2. Check results<br>3. Verify accuracy | Returns all violations for plate | 51D-99999 |
| TC-VH-012 | Verify case-insensitive plate search | High | 1. Query with "51d-99999"<br>2. Check results<br>3. Verify | Returns same results as "51D-99999" | 51d-99999 |
| TC-VH-013 | Verify violation sorting | High | 1. Query violations<br>2. Check order<br>3. Verify sorting | Sorted by violation_date descending | 51D-99999 |
| TC-VH-014 | Verify violation with no results | High | 1. Query non-existent plate<br>2. Check result<br>3. Verify | Returns empty array | NONEXISTENT |
| TC-VH-015 | Verify violation query performance | High | 1. Query plate with 100+ violations<br>2. Measure time<br>3. Check performance | Query completes in <500ms | Plate with many violations |
| TC-VH-016 | Verify violation status filtering | Medium | 1. Query violations<br>2. Filter by status "unpaid"<br>3. Verify results | Only unpaid violations returned | 51D-99999 |
| TC-VH-017 | Verify violation date range filtering | Medium | 1. Query violations in date range<br>2. Check results<br>3. Verify | Only violations in range returned | Date range filter |
| TC-VH-018 | Verify violation RLS policy | Critical | 1. Query violations without auth<br>2. Check results<br>3. Verify access | Authenticated users can view violations | N/A |
| TC-VH-019 | Verify violation query error handling | High | 1. Disconnect database<br>2. Attempt query<br>3. Observe error | Graceful error handling | N/A |
| TC-VH-020 | Verify violation pagination | Medium | 1. Query plate with 100+ violations<br>2. Use pagination<br>3. Verify | Pagination works correctly | Plate with many violations |

### 6.3 Violation Updates (TC-VH-021 to TC-VH-030)

| Test Case ID | Test Case Name | Priority | Test Steps | Expected Result | Test Data |
|-------------|----------------|----------|------------|-----------------|-----------|
| TC-VH-021 | Verify violation status update | High | 1. Update violation status to "paid"<br>2. Query violation<br>3. Verify change | Status updated in database | Test violation |
| TC-VH-022 | Verify violation payment recording | High | 1. Mark violation as paid<br>2. Check timestamp<br>3. Verify | Payment timestamp recorded | Test violation |
| TC-VH-023 | Verify violation fine amount update | Medium | 1. Update fine amount<br>2. Query violation<br>3. Verify change | Fine amount updated | Test violation |
| TC-VH-024 | Verify violation update permissions | Critical | 1. Attempt update as non-admin<br>2. Observe result<br>3. Verify | Proper permission enforcement | Test violation |
| TC-VH-025 | Verify violation description update | Low | 1. Update description<br>2. Query violation<br>3. Verify change | Description updated | Test violation |
| TC-VH-026 | Verify violation location update | Low | 1. Update location<br>2. Query violation<br>3. Verify change | Location updated | Test violation |
| TC-VH-027 | Verify violation audit trail | Low | 1. Update violation<br>2. Check audit log<br>3. Verify entry | Changes logged (if implemented) | Test violation |
| TC-VH-028 | Verify bulk violation status update | Medium | 1. Update 50 violations to "paid"<br>2. Query violations<br>3. Verify | All updated correctly | 50 test violations |
| TC-VH-029 | Verify violation update validation | High | 1. Attempt invalid status update<br>2. Observe error<br>3. Verify | Invalid values rejected | Invalid status |
| TC-VH-030 | Verify concurrent violation updates | Medium | 1. Update same violation from 2 clients<br>2. Check final state<br>3. Verify | Last write wins or conflict resolution | Test violation |

---

## 7. Database & RLS Policies

### 7.1 RLS - License Plate Scans (TC-RLS-001 to TC-RLS-008)

| Test Case ID | Test Case Name | Priority | Test Steps | Expected Result | Test Data |
|-------------|----------------|----------|------------|-----------------|-----------|
| TC-RLS-001 | Verify user can view own scans | Critical | 1. Login as User A<br>2. Query scans<br>3. Verify results | Only User A's scans returned | User A with scans |
| TC-RLS-002 | Verify user cannot view other's scans | Critical | 1. Login as User A<br>2. Attempt to query User B's scans<br>3. Verify | No results returned | User B with scans |
| TC-RLS-003 | Verify user can insert own scans | Critical | 1. Login as User A<br>2. Insert scan with user_id = A<br>3. Verify | Scan inserted successfully | User A |
| TC-RLS-004 | Verify user cannot insert for other users | Critical | 1. Login as User A<br>2. Attempt insert with user_id = B<br>3. Observe | Insert rejected (RLS violation) | User A attempting for User B |
| TC-RLS-005 | Verify user can update own scans | High | 1. Login as User A<br>2. Update own scan<br>3. Verify | Update successful | User A with scan |
| TC-RLS-006 | Verify user cannot update other's scans | Critical | 1. Login as User A<br>2. Attempt update User B's scan<br>3. Observe | Update rejected | User B's scan |
| TC-RLS-007 | Verify user can delete own scans | High | 1. Login as User A<br>2. Delete own scan<br>3. Verify | Delete successful | User A with scan |
| TC-RLS-008 | Verify user cannot delete other's scans | Critical | 1. Login as User A<br>2. Attempt delete User B's scan<br>3. Observe | Delete rejected | User B's scan |

### 7.2 RLS - Search History (TC-RLS-009 to TC-RLS-015)

| Test Case ID | Test Case Name | Priority | Test Steps | Expected Result | Test Data |
|-------------|----------------|----------|------------|-----------------|-----------|
| TC-RLS-009 | Verify user can view own search history | Critical | 1. Login as User A<br>2. Query search history<br>3. Verify | Only User A's history returned | User A with history |
| TC-RLS-010 | Verify user cannot view other's search history | Critical | 1. Login as User A<br>2. Attempt query User B's history<br>3. Verify | No results returned | User B with history |
| TC-RLS-011 | Verify user can insert own search history | Critical | 1. Login as User A<br>2. Insert search record<br>3. Verify | Insert successful | User A |
| TC-RLS-012 | Verify user cannot insert for other users | Critical | 1. Login as User A<br>2. Attempt insert with user_id = B<br>3. Observe | Insert rejected | User A for User B |
| TC-RLS-013 | Verify user can delete own search history | High | 1. Login as User A<br>2. Delete own search<br>3. Verify | Delete successful | User A with history |
| TC-RLS-014 | Verify user cannot delete other's search history | Critical | 1. Login as User A<br>2. Attempt delete User B's search<br>3. Observe | Delete rejected | User B's history |
| TC-RLS-015 | Verify unauthenticated user cannot access history | Critical | 1. Logout<br>2. Attempt query search_history<br>3. Verify | Access denied or empty result | N/A |

### 7.3 RLS - Violations (TC-RLS-016 to TC-RLS-020)

| Test Case ID | Test Case Name | Priority | Test Steps | Expected Result | Test Data |
|-------------|----------------|----------|------------|-----------------|-----------|
| TC-RLS-016 | Verify authenticated users can view violations | Critical | 1. Login<br>2. Query violations<br>3. Verify access | Violations accessible | Authenticated user |
| TC-RLS-017 | Verify unauthenticated users cannot view violations | High | 1. Logout<br>2. Attempt query violations<br>3. Verify | Access denied | N/A |
| TC-RLS-018 | Verify users cannot insert violations | Critical | 1. Login<br>2. Attempt insert violation<br>3. Observe | Insert rejected (admin-only) | Regular user |
| TC-RLS-019 | Verify users cannot update violations | Critical | 1. Login<br>2. Attempt update violation<br>3. Observe | Update rejected (admin-only) | Regular user |
| TC-RLS-020 | Verify users cannot delete violations | Critical | 1. Login<br>2. Attempt delete violation<br>3. Observe | Delete rejected (admin-only) | Regular user |

### 7.4 Database Integrity (TC-DB-021 to TC-DB-030)

| Test Case ID | Test Case Name | Priority | Test Steps | Expected Result | Test Data |
|-------------|----------------|----------|------------|-----------------|-----------|
| TC-DB-021 | Verify UUID generation for primary keys | High | 1. Insert record without ID<br>2. Check database<br>3. Verify UUID | UUID auto-generated | Any table |
| TC-DB-022 | Verify timestamp defaults | High | 1. Insert record without timestamp<br>2. Check database<br>3. Verify | Timestamp set to now() | Any table with timestamps |
| TC-DB-023 | Verify foreign key constraints | High | 1. Attempt insert with invalid foreign key<br>2. Observe error<br>3. Verify | Foreign key violation error | Invalid user_id |
| TC-DB-024 | Verify unique constraints | High | 1. Attempt insert duplicate unique value<br>2. Observe error<br>3. Verify | Unique constraint violation | Duplicate email |
| TC-DB-025 | Verify not-null constraints | High | 1. Attempt insert null into required field<br>2. Observe error<br>3. Verify | Not-null constraint violation | Null plate_number |
| TC-DB-026 | Verify data type enforcement | Medium | 1. Attempt insert wrong data type<br>2. Observe error<br>3. Verify | Type mismatch error | String in numeric field |
| TC-DB-027 | Verify transaction rollback | High | 1. Begin transaction<br>2. Make changes<br>3. Rollback<br>4. Verify | Changes not persisted | Any table |
| TC-DB-028 | Verify transaction commit | High | 1. Begin transaction<br>2. Make changes<br>3. Commit<br>4. Verify | Changes persisted | Any table |
| TC-DB-029 | Verify database backup/restore | Medium | 1. Create backup<br>2. Make changes<br>3. Restore backup<br>4. Verify | Data restored to backup state | N/A |
| TC-DB-030 | Verify index performance | Medium | 1. Query indexed field<br>2. Measure time<br>3. Compare to non-indexed | Indexed queries faster | Large dataset |

---

## 8. Edge Functions

### 8.1 recognize-license-plate Function (TC-EF-001 to TC-EF-015)

| Test Case ID | Test Case Name | Priority | Test Steps | Expected Result | Test Data |
|-------------|----------------|----------|------------|-----------------|-----------|
| TC-EF-001 | Verify edge function authentication | Critical | 1. Call function without auth<br>2. Observe response<br>3. Verify | 401 Unauthorized error | N/A |
| TC-EF-002 | Verify edge function with valid JWT | Critical | 1. Call function with valid JWT<br>2. Send image<br>3. Observe response | Function processes request | Valid image + JWT |
| TC-EF-003 | Verify edge function with invalid JWT | High | 1. Call function with invalid JWT<br>2. Observe response<br>3. Verify | 401 Unauthorized error | Invalid JWT |
| TC-EF-004 | Verify edge function request validation | High | 1. Send request without imageBase64<br>2. Observe response<br>3. Verify | 400 Bad Request error | Missing imageBase64 |
| TC-EF-005 | Verify edge function image processing | Critical | 1. Send valid plate image<br>2. Observe response<br>3. Verify result | Returns plate number and confidence | 30A-12345 image |
| TC-EF-006 | Verify edge function error handling | High | 1. Send invalid image<br>2. Observe response<br>3. Verify | Error message returned | Invalid image |
| TC-EF-007 | Verify edge function timeout | High | 1. Send very large image<br>2. Monitor processing<br>3. Check timeout | Times out after 30s or processes | 20MB image |
| TC-EF-008 | Verify edge function CORS headers | Medium | 1. Call from browser<br>2. Check response headers<br>3. Verify CORS | CORS headers present | N/A |
| TC-EF-009 | Verify edge function rate limiting | Medium | 1. Call function 100 times rapidly<br>2. Observe responses<br>3. Check limiting | Rate limit applied if configured | N/A |
| TC-EF-010 | Verify edge function logging | Medium | 1. Call function<br>2. Check edge function logs<br>3. Verify | Request logged | Valid request |
| TC-EF-011 | Verify edge function memory usage | Medium | 1. Process large image<br>2. Monitor memory<br>3. Verify limits | Stays within memory limits | Large image |
| TC-EF-012 | Verify edge function cold start time | High | 1. Call function after idle period<br>2. Measure response time<br>3. Check | Cold start <3s | N/A |
| TC-EF-013 | Verify edge function warm performance | High | 1. Call function consecutively<br>2. Measure response times<br>3. Compare | Warm calls <1s | Multiple calls |
| TC-EF-014 | Verify edge function error responses | High | 1. Trigger various errors<br>2. Check response structure<br>3. Verify | Consistent error format | Various errors |
| TC-EF-015 | Verify edge function deployment | High | 1. Update function code<br>2. Deploy<br>3. Test<br>4. Verify | Changes deployed successfully | Code change |

### 8.2 Edge Function Integration (TC-EF-016 to TC-EF-025)

| Test Case ID | Test Case Name | Priority | Test Steps | Expected Result | Test Data |
|-------------|----------------|----------|------------|-----------------|-----------|
| TC-EF-016 | Verify frontend to edge function call | Critical | 1. Use AI recognition in app<br>2. Check network tab<br>3. Verify call | Edge function called correctly | Test image |
| TC-EF-017 | Verify edge function response parsing | High | 1. Call function<br>2. Receive response<br>3. Parse in frontend<br>4. Verify | Response parsed correctly | Valid image |
| TC-EF-018 | Verify edge function error display in UI | High | 1. Trigger function error<br>2. Observe UI<br>3. Check message | Error message displayed to user | Invalid request |
| TC-EF-019 | Verify edge function retry logic | Medium | 1. Fail function call<br>2. Observe retry<br>3. Verify behavior | Retries or shows error | Network failure |
| TC-EF-020 | Verify edge function caching | Low | 1. Call with same image twice<br>2. Compare response times<br>3. Check | Second call faster if cached | Same image x2 |
| TC-EF-021 | Verify edge function with different image types | High | 1. Send JPG<br>2. Send PNG<br>3. Send WEBP<br>4. Verify | All types processed | Multiple formats |
| TC-EF-022 | Verify edge function base64 encoding | High | 1. Encode image to base64<br>2. Send to function<br>3. Verify processing | Decodes and processes correctly | Base64 image |
| TC-EF-023 | Verify edge function response time | High | 1. Send standard image<br>2. Measure end-to-end time<br>3. Verify | Total time <5s | Standard plate image |
| TC-EF-024 | Verify edge function concurrent requests | Medium | 1. Send 10 requests simultaneously<br>2. Check all responses<br>3. Verify | All processed successfully | 10 images |
| TC-EF-025 | Verify edge function monitoring | Low | 1. Call function<br>2. Check monitoring dashboard<br>3. Verify metrics | Metrics logged (invocations, errors) | N/A |

---

## 9. Map Integration

### 9.1 Map Display (TC-MAP-001 to TC-MAP-010)

| Test Case ID | Test Case Name | Priority | Test Steps | Expected Result | Test Data |
|-------------|----------------|----------|------------|-----------------|-----------|
| TC-MAP-001 | Verify map initialization | High | 1. Navigate to map page<br>2. Observe map load<br>3. Verify display | Map displays centered on Da Nang | N/A |
| TC-MAP-002 | Verify map center coordinates | High | 1. Check map center<br>2. Verify coordinates<br>3. Check accuracy | Centered on Da Nang (16.0471, 108.2068) | N/A |
| TC-MAP-003 | Verify map zoom controls | Medium | 1. Click zoom in<br>2. Click zoom out<br>3. Verify behavior | Map zooms correctly | N/A |
| TC-MAP-004 | Verify map pan functionality | Medium | 1. Drag map<br>2. Observe movement<br>3. Verify smoothness | Map pans smoothly | N/A |
| TC-MAP-005 | Verify map tile loading | High | 1. Pan to new area<br>2. Observe tiles<br>3. Verify loading | Tiles load without errors | N/A |
| TC-MAP-006 | Verify map responsive design | Medium | 1. Resize window<br>2. Observe map<br>3. Check on mobile | Map adapts to screen size | N/A |
| TC-MAP-007 | Verify map layer controls | Low | 1. Toggle map layers<br>2. Observe changes<br>3. Verify | Layers switch correctly | N/A |
| TC-MAP-008 | Verify map marker display | High | 1. Add markers<br>2. Observe on map<br>3. Verify visibility | Markers display at correct locations | Test coordinates |
| TC-MAP-009 | Verify map popup on marker click | Medium | 1. Click marker<br>2. Observe popup<br>3. Check content | Popup displays with info | Test marker |
| TC-MAP-010 | Verify map performance with many markers | Medium | 1. Add 100+ markers<br>2. Pan/zoom map<br>3. Check performance | Map remains responsive | 100 test markers |

### 9.2 Geolocation (TC-MAP-011 to TC-MAP-020)

| Test Case ID | Test Case Name | Priority | Test Steps | Expected Result | Test Data |
|-------------|----------------|----------|------------|-----------------|-----------|
| TC-MAP-011 | Verify geolocation permission request | High | 1. Enable location feature<br>2. Observe permission dialog<br>3. Verify | Browser requests location permission | N/A |
| TC-MAP-012 | Verify geolocation on permission grant | High | 1. Grant location permission<br>2. Observe map<br>3. Verify | User's location shown on map | N/A |
| TC-MAP-013 | Verify geolocation error on deny | High | 1. Deny location permission<br>2. Observe error<br>3. Verify message | Error message displayed | N/A |
| TC-MAP-014 | Verify geolocation accuracy | Medium | 1. Enable location<br>2. Check coordinates<br>3. Verify accuracy | Coordinates accurate to GPS | N/A |
| TC-MAP-015 | Verify geolocation marker icon | Low | 1. Enable location<br>2. Observe user marker<br>3. Check icon | Distinct icon for user location | N/A |
| TC-MAP-016 | Verify geolocation auto-center | Medium | 1. Enable location<br>2. Observe map<br>3. Verify centering | Map centers on user's location | N/A |
| TC-MAP-017 | Verify geolocation updates | Low | 1. Move physically<br>2. Observe map<br>3. Check update | Location updates on map (if implemented) | N/A |
| TC-MAP-018 | Verify geolocation saving with scan | Medium | 1. Scan plate with location enabled<br>2. Check database<br>3. Verify | Lat/lng saved with scan record | Test scan |
| TC-MAP-019 | Verify geolocation timeout handling | Medium | 1. Enable location in area with no GPS<br>2. Observe timeout<br>3. Verify | Timeout error handled gracefully | N/A |
| TC-MAP-020 | Verify geolocation privacy | High | 1. Check location data usage<br>2. Verify storage<br>3. Check privacy | Location only saved with user consent | N/A |

---

## 10. Performance Testing

### 10.1 Load Testing (TC-PERF-001 to TC-PERF-005)

| Test Case ID | Test Case Name | Priority | Test Steps | Expected Result | Test Data |
|-------------|----------------|----------|------------|-----------------|-----------|
| TC-PERF-001 | Verify app initial load time | High | 1. Clear cache<br>2. Navigate to app<br>3. Measure load time<br>4. Verify | Page loads in <3s | N/A |
| TC-PERF-002 | Verify CNN model load time | High | 1. Navigate to scanner<br>2. Measure model load time<br>3. Verify | Model loads in <5s | N/A |
| TC-PERF-003 | Verify database query performance | High | 1. Query violations for plate<br>2. Measure time<br>3. Verify | Query completes in <500ms | 51D-99999 |
| TC-PERF-004 | Verify concurrent user handling | High | 1. Simulate 50 concurrent users<br>2. Perform various actions<br>3. Monitor performance | App remains responsive | 50 virtual users |
| TC-PERF-005 | Verify image processing time | High | 1. Process standard image<br>2. Measure total time<br>3. Verify | Processing completes in <3s | Standard plate image |

### 10.2 Scalability (TC-PERF-006 to TC-PERF-010)

| Test Case ID | Test Case Name | Priority | Test Steps | Expected Result | Test Data |
|-------------|----------------|----------|------------|-----------------|-----------|
| TC-PERF-006 | Verify handling 1000+ violation records | Medium | 1. Query plate with 1000+ violations<br>2. Observe performance<br>3. Verify | Results paginated, loads in <2s | Plate with 1000+ violations |
| TC-PERF-007 | Verify handling 10000+ scan records | Medium | 1. User with 10000+ scans<br>2. View history<br>3. Check performance | History paginated, responsive | User with 10000 scans |
| TC-PERF-008 | Verify database connection pooling | Medium | 1. Make 100 simultaneous queries<br>2. Monitor connections<br>3. Verify | Connection pool manages efficiently | N/A |
| TC-PERF-009 | Verify edge function scaling | Medium | 1. Send 100 concurrent requests<br>2. Monitor function instances<br>3. Verify | Functions scale automatically | 100 concurrent requests |
| TC-PERF-010 | Verify CDN caching for static assets | Low | 1. Load app<br>2. Check network tab<br>3. Verify caching | Static assets cached (304 responses) | N/A |

### 10.3 Memory & Resource Management (TC-PERF-011 to TC-PERF-015)

| Test Case ID | Test Case Name | Priority | Test Steps | Expected Result | Test Data |
|-------------|----------------|----------|------------|-----------------|-----------|
| TC-PERF-011 | Verify no memory leaks in scanner | High | 1. Scan 50 images consecutively<br>2. Monitor memory usage<br>3. Verify | Memory stabilizes, no continuous growth | 50 images |
| TC-PERF-012 | Verify camera resource cleanup | High | 1. Start/stop camera 10 times<br>2. Monitor resources<br>3. Verify | Camera resources released each time | N/A |
| TC-PERF-013 | Verify CNN model memory usage | Medium | 1. Load CNN model<br>2. Monitor memory<br>3. Verify | Model uses <500MB memory | N/A |
| TC-PERF-014 | Verify browser local storage limits | Low | 1. Store large amounts of data<br>2. Check storage usage<br>3. Verify | Stays within browser limits | Large dataset |
| TC-PERF-015 | Verify cleanup on navigation away | Medium | 1. Use scanner<br>2. Navigate away<br>3. Monitor resources<br>4. Verify | Resources cleaned up on unmount | N/A |

---

## Test Data Requirements

### Sample License Plates
- **30A-12345**: Clean record, no violations
- **51D-99999**: Multiple violations, unpaid fines
- **92C-88888**: 1 violation, paid status
- **43K-11111**: 2 violations, mixed status
- **50F-12340**: Large number of violations (100+)

### Sample Violations
```sql
-- Violation 1: Speeding
INSERT INTO violations (plate_number, violation_type, violation_date, fine_amount, status, location, description)
VALUES ('51D-99999', 'Vượt tốc độ', '2025-11-15 10:30:00', 2000000, 'unpaid', 'Đà Nẵng - QL1A', 'Vượt tốc độ 20km/h');

-- Violation 2: Red Light
INSERT INTO violations (plate_number, violation_type, violation_date, fine_amount, status, location, description)
VALUES ('51D-99999', 'Vượt đèn đỏ', '2025-11-10 14:15:00', 1500000, 'unpaid', 'Đà Nẵng - Ngã tư Hàn', 'Vượt đèn đỏ tại ngã tư');

-- Violation 3: Parking
INSERT INTO violations (plate_number, violation_type, violation_date, fine_amount, status, location, description)
VALUES ('92C-88888', 'Đỗ xe sai quy định', '2025-11-05 08:00:00', 500000, 'paid', 'Đà Nẵng - Đường Trần Phú', 'Đỗ xe vỉa hè');
```

### Test Users
- **test1@example.com**: Regular user with scan history
- **test2@example.com**: New user, no activity
- **test3@example.com**: Power user with 1000+ scans

### Test Images
- **clear-plate.jpg**: High quality, good lighting
- **blurry-plate.jpg**: Poor quality, motion blur
- **angled-plate.jpg**: Plate at 30° angle
- **dark-plate.jpg**: Low lighting conditions
- **partial-plate.jpg**: Partially obscured plate

---

## Test Environment

### Frontend
- **Browser**: Chrome 120+, Firefox 121+, Safari 17+
- **Device**: Desktop (1920x1080), Tablet (768x1024), Mobile (375x667)
- **Network**: 4G, 3G, WiFi

### Backend
- **Database**: Lovable Cloud (Supabase PostgreSQL)
- **Edge Functions**: Deno runtime
- **Authentication**: Supabase Auth

### Tools
- **Manual Testing**: Browser DevTools
- **Automated Testing**: Jest, React Testing Library
- **Performance**: Lighthouse, Chrome Performance Profiler
- **Load Testing**: Artillery, k6
- **API Testing**: Postman, Insomnia

---

## Test Execution Schedule

### Phase 1: Critical Features (Week 1-2)
- License Plate Scanner core functionality
- Authentication system
- Violation checker
- RLS policies

### Phase 2: Integration & Data (Week 3)
- Database integrity
- Edge functions
- History management
- Dashboard

### Phase 3: Performance & Optimization (Week 4)
- Load testing
- Performance optimization
- Memory leak checks
- Scalability testing

### Phase 4: Final Validation (Week 5)
- End-to-end user flows
- Security audit
- Accessibility testing
- Cross-browser testing

---

## Acceptance Criteria

✅ All Critical (P0) test cases pass: 100%  
✅ All High (P1) test cases pass: ≥95%  
✅ All Medium (P2) test cases pass: ≥90%  
✅ All Low (P3) test cases pass: ≥85%  
✅ No Critical security vulnerabilities  
✅ Performance metrics meet targets  
✅ RLS policies properly enforced  
✅ Zero authentication bypass issues  
✅ Mobile responsiveness verified  
✅ Accessibility standards met (WCAG 2.1 AA)

---

**End of Test Cases Document**