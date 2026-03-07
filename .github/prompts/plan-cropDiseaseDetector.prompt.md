## Plan: Crop Disease Detection Integration

Use a direct API or Supabase Edge Function inference flow mounted from the image modal; n8n is not required for the initial implementation. The current codebase already has reusable image upload, signed URL, and model-storage patterns, so the fastest and cleanest path is: modal trigger -> server action/API route -> inference provider -> persist + display result.

**Steps**

1. Confirm inference backend choice and execution mode: external inference API (fastest MVP) or Supabase Edge Function wrapper (preferred production boundary). This decision defines auth, latency, and error handling behavior.
2. Define the request/response contract for detection using the existing `CropDiseaseData` structure, including confidence score and fallback `unknown` response for low-confidence predictions.
3. Add a dedicated backend entry point (`app/api/detect-crop-disease/route.ts` or `app/actions/CropDiseaseDetectionAction.ts`) that accepts a storage path or signed URL and calls inference; return normalized disease result payload. _depends on 1 and 2_
4. Persist detection output in a new table (for traceability and analytics), linking records to monitoring/post-travel context where available. _parallel with step 5 after schema is approved_
5. Extend `components/ui/image-modal.tsx` with a `Detect` button beside the existing zoom controls, plus loading/error states while AI is processing. _depends on 3_
6. Resolve image identity mapping for modal calls: pass storage path alongside `imageSrc` to avoid reverse-parsing signed URLs and to keep calls deterministic.
7. Show a `Drawer` (shadcn/ui) after successful detection with these fields: common name, scientific name, and ways to prevent; include confidence display if available. _depends on 5_
8. Add guardrails: file type/size validation reuse, inference timeout/retry policy, and user-facing error messages for API unavailability. _parallel with step 5_
9. Verify end-to-end behavior in report flows where images originate (`image-report-form` and monitoring actions), ensuring the modal can invoke detection for uploaded images consistently.

**Detector Interaction Flow**

1. User opens image in `image-modal`.
2. User clicks `Detect` button located beside zoom controls.
3. UI enters processing state (`Analyzing...`) and disables repeated clicks.
4. Backend inference returns predicted disease/pest details.
5. A shadcn/ui `Drawer` opens and displays:
   - Name (common name)
   - Scientific name
   - Ways to prevent (list)
6. If inference fails or confidence is too low, show a clear fallback message and keep the user in the modal.

**Relevant files**

- `c:\Users\Okonut\Documents\Web Projects\agri-promis\components\ui\image-modal.tsx` — add detector trigger UI/state and display block.
- `c:\Users\Okonut\Documents\Web Projects\agri-promis\components\ui\drawer.tsx` — use shadcn/ui drawer primitive for detection result details.
- `c:\Users\Okonut\Documents\Web Projects\agri-promis\components\interfaces.ts` — reuse `CropDiseaseData` and extend if confidence/source metadata is needed.
- `c:\Users\Okonut\Documents\Web Projects\agri-promis\app\actions\MonitoringAction.ts` — reuse upload/signing/storage interaction patterns.
- `c:\Users\Okonut\Documents\Web Projects\agri-promis\components\custom\forms\image-report-form.tsx` — ensure path data needed by modal is available.
- `c:\Users\Okonut\Documents\Web Projects\agri-promis\lib\utils.ts` — reuse image pre-processing helpers before inference when appropriate.
- `c:\Users\Okonut\Documents\Web Projects\agri-promis\utils\helpers\validateImages.ts` — align detector input constraints with existing validation.
- `c:\Users\Okonut\Documents\Web Projects\agri-promis\app\api\get-model-url\route.ts` — reference signed URL and storage access pattern.
- `c:\Users\Okonut\Documents\Web Projects\agri-promis\app\api\save-model\route.ts` — reference model storage/auth pattern.
- `c:\Users\Okonut\Documents\Web Projects\agri-promis\app\api\upload-training-examples\route.ts` — reuse labeled image upload conventions for future retraining workflows.
- `c:\Users\Okonut\Documents\Web Projects\agri-promis\schema.sql` — add `crop_disease_detections` schema and indexes.

**Verification**

1. Run lint/type checks and ensure new backend endpoint/action compiles with existing Next.js server constraints.
2. Execute detector call using a known healthy image and known diseased image; verify normalized response schema and confidence behavior.
3. Open modal with uploaded image and validate UI states: idle, analyzing, success, and failure.
4. Confirm successful detection opens shadcn/ui drawer with name, scientific name, and prevention guidance.
5. Validate timeout/retry handling by simulating inference API unavailability.
6. Confirm persisted detection rows contain image path, disease label, confidence, raw payload, and timestamps.
7. Run regression checks on existing image upload/report submission flows.

**Decisions**

- n8n is excluded from MVP scope: direct backend inference call is simpler, lower latency, and matches current architecture.
- n8n becomes in-scope only if you need multi-step workflow orchestration (for example detect -> notify -> create ticket -> retraining queue).
- Included scope: disease detection trigger from modal + backend inference + optional persistence.
- Included scope: `Detect` button in modal controls + AI processing state + result drawer with prevention guidance.
- Excluded scope: building/training a new ML model pipeline from scratch.

**Further Considerations**

1. Inference host choice: Option A external API now (fastest), Option B Supabase Edge Function facade (better long-term governance), Option C fully self-hosted model service (highest control, highest ops).
2. Trigger mode: Option A manual per image in modal (recommended first), Option B auto-run on upload, Option C async queue with later result notification.
3. Confidence policy: Option A fixed threshold globally, Option B crop-specific threshold map, Option C return top-3 predictions and let user confirm.
