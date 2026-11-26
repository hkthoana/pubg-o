/**
 * OWEN VIP PATCH V2 — Shadowrocket All-in-One Bypass
 * Chạy trực tiếp 100% trên iPhone không cần máy tính.
 */
(function () {
    // --- 1. XỬ LÝ RESPONSE: Tự động bỏ qua hộp nhập key ---
    if (typeof $response !== "undefined") {
        var body = $response.body || "";
        if (body.indexOf("else state('needs_key'") !== -1) {
            body = body.replace(
                "else state('needs_key','Nhập key OWEN để kích hoạt menu mod.');A.Show() end",
                "else state('validating_session','[NO-KEY] Đang tự động kích hoạt...');A.Submit('OW-NOKEY-BYPASS') end"
            );
            $done({ body: body });
            return;
        }
        $done({});
        return;
    }

    // --- 2. XỬ LÝ REQUEST: Giả lập License, Ticket, Payload & Chặn feedback ---
    if (typeof $request === "undefined") {
        $done({});
        return;
    }

    var url = $request.url || "";
    var now = Math.floor(Date.now() / 1000);

    var RELEASE_KEY = "WTVrWSwSiIFdbcytmXlvuAYEklYbm7n3yfuSALbBFjs=";
    var FAKE_TOKEN = "dl1_5vDkWrRjl5cn_OAb9ewfWoC4c9CdXEGFfJuYTxV8GpQ";
    var FAKE_TICKET = "v1.eyJ2IjoxLCJubyI6ImtleSJ9.bypass";
    var PAYLOAD_SHA256 = "3736683e597445d17dfd4999b235181359101fc35cea6d32543d261601ae70e8";
    var PAYLOAD_BYTES = 5879543;
    var REMOTE_PAYLOAD_URL = "https://raw.githubusercontent.com/hkthoana/pubg-owen/main/owen_payload.bin";

    // Giả lập Gateway bản quyền: activate / validate -> VIP 1000 ngày + khóa rk
    if (url.indexOf("owen-license-gateway.owenindahouse-dev.workers.dev") !== -1) {
        if (url.indexOf("/v1/license/activate") !== -1 || url.indexOf("/v1/license/validate") !== -1) {
            $done({
                response: {
                    status: 200,
                    headers: {
                        "Content-Type": "application/json; charset=utf-8",
                        "Cache-Control": "no-store"
                    },
                    body: JSON.stringify({
                        ok: true,
                        token: FAKE_TOKEN,
                        tier: "chinese",
                        license_tier: "paid",
                        expires_at: now + 1000 * 86400,
                        access_schema: 1,
                        access_level: "vip",
                        channel: "chinese",
                        download_mode: "ticket-v1",
                        download_ticket: FAKE_TICKET,
                        download_expires_at: now + 900,
                        rk: RELEASE_KEY
                    })
                }
            });
            return;
        }
    }

    // Giả lập tải vé & chuyển hướng payload sang GitHub Raw
    if (url.indexOf("owenindahouse.junpio2752.workers.dev") !== -1) {
        if (url.indexOf("/v1/download-ticket") !== -1) {
            $done({
                response: {
                    status: 200,
                    headers: {
                        "Content-Type": "application/json; charset=utf-8",
                        "Cache-Control": "no-store"
                    },
                    body: JSON.stringify({
                        ok: true,
                        download_ticket: FAKE_TICKET,
                        expires_at: now + 300,
                        version: PAYLOAD_SHA256,
                        bytes: PAYLOAD_BYTES,
                        payload_path: "/payload"
                    })
                }
            });
            return;
        }

        if (url.indexOf("/payload") !== -1) {
            $done({
                response: {
                    status: 302,
                    headers: {
                        "Location": REMOTE_PAYLOAD_URL
                    }
                }
            });
            return;
        }
    }

    // Chặn telemetry feedback dữ liệu trận đấu / ảnh chụp
    if (url.indexOf("autofeedback.owenindahouse-dev.workers.dev") !== -1) {
        $done({
            response: {
                status: 200,
                headers: { "Content-Type": "application/json; charset=utf-8" },
                body: JSON.stringify({ ok: true, blocked: true })
            }
        });
        return;
    }

    $done({});
})();
