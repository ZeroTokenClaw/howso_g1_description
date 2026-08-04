import { useState } from "react";
import { FullscreenOutlined, PlusOutlined, SearchOutlined, PlayCircleOutlined, RightOutlined, LinkOutlined } from "@ant-design/icons";
import { Button, Input, message, Modal, Tag, Tooltip } from "antd";

// 鈹€鈹€ Studio 璺宠浆 URL 鏋勯€犲櫒 鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€
const MCAP_BASE = "https://io-sample-data-sh-1328702871.cos.ap-shanghai.myqcloud.com/dataset";
const STUDIO_BASE = "http://ai.yun36.com:8765/studio";

function makeStudioUrl(datasetName: string, mcapQuery: string): string {
  const mcapUrl = `${MCAP_BASE}/${datasetName}.mcap${mcapQuery}`;
  return `${STUDIO_BASE}?ds=remote-file&ds.url=${encodeURIComponent(mcapUrl)}&ds.name=${encodeURIComponent(datasetName)}&autoplay=y`;
}

// 姣忎釜鎶€鑳藉搴旂殑鏁版嵁闆嗗悕绉板強 mcap 绛惧悕鍙傛暟锛堟湁鏁堟湡鍐呬娇鐢紱鍙浛鎹級
const SKILL_STUDIO_URL: Record<string, string> = {
  pick:      makeStudioUrl("20241025_office_PickPlace_mahz_113217", ""),
  place:     makeStudioUrl("20241025_office_PickPlace_mahz_113217", ""),
  transfer:  makeStudioUrl("20241025_office_PickPlace_mahz_113217", ""),
  push:      makeStudioUrl("20241025_office_PickPlace_mahz_113217", ""),
  move:      makeStudioUrl("20241025_office_PickPlace_mahz_113217", ""),
  insert:    makeStudioUrl("20241025_office_PickPlace_mahz_113217", ""),
  pull:      makeStudioUrl("20241025_office_PickPlace_mahz_113217", ""),
  calibrate: makeStudioUrl("20241025_office_PickPlace_mahz_113217", ""),
  separate:  makeStudioUrl("20241025_office_PickPlace_mahz_113217", ""),
  toss:      makeStudioUrl("20241025_office_PickPlace_mahz_113217", ""),
  clamp:     makeStudioUrl("20241025_office_PickPlace_mahz_113217", ""),
  turn:      makeStudioUrl("20241025_office_PickPlace_mahz_113217", ""),
};

// 鈹€鈹€ 鍔ㄤ綔 key 鈫?涓枃鎶€鑳藉悕 鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€
const ACTION_ZH: Record<string, string> = {
  pick:      "浠?(B) 鎹¤捣 (A)",
  place:     "鏀剧疆 (A) 鍒?(B)",
  transfer:  "浼犻€?(A)",
  push:      "鎺?(A)",
  move:      "绉诲姩 (A) 鍒?(B)",
  insert:    "鎻掑叆 (A) 鍒?(B)",
  pull:      "鎷夊彇 (A)",
  calibrate: "鏍″噯 (A)",
  separate:  "鍒嗗紑 (A)",
  toss:      "鎶涘嚭 (A)",
  clamp:     "澶瑰彇 (A)",
  turn:      "杞姩 (A)",
};

// 鈹€鈹€ 鍔ㄤ綔 key 鈫?鏁版嵁閲忥紙鏉ヨ嚜鍘熷骞冲彴缁熻锛夆攢鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€
const ACTION_COUNT: Record<string, number> = {
  pick: 143, place: 115, transfer: 89, push: 32,
  move: 27, insert: 19, pull: 15, calibrate: 11,
  separate: 7, toss: 4, clamp: 3, turn: 2,
};

// 鈹€鈹€ 姣忎釜鍔ㄤ綔瀵瑰簲鐨勬湰鍦板浘鐗囷紙鏂囦欢鍚?鈫?鍔ㄤ綔绫诲瀷锛屾潵鑷?media_urls.json 绮剧‘鏄犲皠锛?
// 鏍煎紡锛歿 action: [ { file, caption } ] }
// caption 鐩存帴鎻忚堪鍥剧墖鍐呭锛堝姩浣?瀵硅薄锛夛紝涓嶅啀鎵嬪啓涓庡浘鏃犲叧鐨勬枃瀛?
const SKILL_IMAGES: Record<string, { file: string; caption: string }[]> = {
  // 浠?(B) 鎹¤捣 (A)锛氫粠妗岄潰/鎵撳瓟鍙版嬀鍙栨按鏋溿€佸僵鑹茬悆绛夌墿浣?
  pick: [
    { file: "/media/img_161.webp", caption: "鏈烘鑷備粠鎵撳瓟鍙版崱璧锋瀛? },
    { file: "/media/img_162.webp", caption: "淇鎵撳瓟鍙帮細鎷惧彇鍦嗗舰鐗╀綋" },
    { file: "/media/img_035.webp", caption: "榛戣壊澶圭埅浠庢墦瀛斿彴鎹¤捣鏈ㄧ悆" },
    { file: "/media/img_064.webp", caption: "淇妗岄潰锛氭満姊版墜鎷惧彇褰╄壊鐞? },
    { file: "/media/img_065.webp", caption: "鏈烘鎵嬫姄鍙栨闈㈤粍鑹叉按鏋? },
    { file: "/media/img_038.webp", caption: "澶氭寚鏈烘鎵嬫墽琛屾嬀鍙栧姩浣? },
  ],
  // 鏀剧疆 (A) 鍒?(B)锛氬皢鐗╀綋鏀惧叆鎸囧畾瀹瑰櫒/浣嶇疆
  place: [
    { file: "/media/img_068.webp", caption: "淇妗岄潰锛氭満姊版墜鏀剧疆褰╄壊鐞? },
    { file: "/media/img_069.webp", caption: "鏈烘鎵嬪皢姘存灉鏀惧埌妗岄潰鐩爣鍖? },
    { file: "/media/img_070.webp", caption: "鏀剧疆鍔ㄤ綔瀹屾垚钀藉畾甯? },
    { file: "/media/img_111.webp", caption: "鏈烘鎵嬫斁缃孩鑹查鐩? },
    { file: "/media/img_112.webp", caption: "淇锛氶鐩樻斁缃埌鐩爣浣嶇疆" },
    { file: "/media/img_113.webp", caption: "鏈烘鎵嬬簿鍑嗘斁缃埌鐩爣鍖哄煙" },
  ],
  // 浼犻€?(A)锛氬弻鎵嬩箣闂翠紶閫掔墿浣?
  transfer: [
    { file: "/media/img_008.webp", caption: "鍙岃噦鏈哄櫒浜哄乏鍙虫墜闂翠紶閫掔墿浣? },
    { file: "/media/img_009.webp", caption: "宸﹀彸鎵嬪崗浣滃畬鎴愪紶閫? },
    { file: "/media/img_010.webp", caption: "鏈哄櫒浜哄皢鐗╀綋浠庡彸鎵嬩紶鑷冲乏鎵? },
    { file: "/media/img_011.webp", caption: "鍙屾墜浜ゆ帴鍔ㄤ綔杩囩▼甯? },
    { file: "/media/img_094.webp", caption: "鐧借壊鍙岃噦浼犻€掑渾褰㈢墿浣? },
    { file: "/media/img_095.webp", caption: "鍙岃噦鍗忓悓浼犻€掑僵鑹查鐩? },
  ],
  // 鎺?(A)锛氭満姊版墜鎺ㄥ姩鐗╀綋鏀瑰彉浣嶇疆
  push: [
    { file: "/media/img_152.webp", caption: "绾㈣壊鏈烘鑷傛帹鍔ㄦ闈㈢墿浣? },
    { file: "/media/img_153.webp", caption: "鏈烘鎵嬪悜鐩爣鏂瑰悜鎺ㄩ€? },
    { file: "/media/img_154.webp", caption: "淇锛氭帹鍔ㄧ墿浣撳埌鎸囧畾浣嶇疆" },
    { file: "/media/img_155.webp", caption: "鏈哄櫒浜烘墽琛屾帹鍔ㄦ妧鑳? },
    { file: "/media/img_156.webp", caption: "鎺ㄩ€佸姩浣滃畬鎴愬抚" },
    { file: "/media/img_157.webp", caption: "鏈烘鑷傛帹閫佽揣鏋朵笂鐨勭墿鍝? },
  ],
  // 绉诲姩 (A) 鍒?(B)锛氬皢鐗╀綋鏁翠綋鎼Щ鍒板彟涓€澶?
  move: [
    { file: "/media/img_017.webp", caption: "閲戣壊鏈烘鎵嬬Щ鍔ㄦ湪璐ㄥ偍鐗╃" },
    { file: "/media/img_018.webp", caption: "鏈烘鑷傛惉杩愮焊绠卞埌鐩爣浣嶇疆" },
    { file: "/media/img_019.webp", caption: "鏈烘鎵嬬Щ鍔ㄥぇ鍨嬬浣? },
    { file: "/media/img_163.webp", caption: "鐧借壊鍙岃噦鎼繍绾哥" },
    { file: "/media/img_131.webp", caption: "淇锛氭満姊拌噦绉诲姩妗岄潰鍖呰鐗? },
    { file: "/media/img_132.webp", caption: "绉诲姩鏉傝揣鐗╁搧鍒版寚瀹氫綅缃? },
  ],
  // 鎻掑叆 (A) 鍒?(B)锛氬皢鐗╀綋绮惧噯鎻掑叆瀹瑰櫒鎴栨Ы浣?
  insert: [
    { file: "/media/img_158.webp", caption: "鐧借壊鍙岃噦灏嗙墿浣撴彃鍏ュ伐鍏风妲戒綅" },
    { file: "/media/img_159.webp", caption: "鏈烘鎵嬬簿鍑嗘彃鍏ユ搷浣滆繃绋? },
    { file: "/media/img_173.webp", caption: "鍙岃噦鏈哄櫒浜哄崗鍚屾墽琛屾彃鍏ュ姩浣? },
    { file: "/media/img_174.webp", caption: "淇妗岄潰锛氭彃鍏ュ姩浣滃畬鎴愬抚" },
  ],
  // 鎷夊彇 (A)锛氭媺鍔ㄧ墿浣撴垨鎵撳紑鎶藉眽
  pull: [
    { file: "/media/img_013.webp", caption: "鍗曡噦鏈哄櫒浜烘媺鍙栨闈㈢孩鑹茬墿浣? },
    { file: "/media/img_014.webp", caption: "鏈烘鎵嬫媺鍙栫洰鏍囩墿杩囩▼甯? },
    { file: "/media/img_020.webp", caption: "鏈烘鎵嬫媺鍔ㄦ湪绠变晶闈? },
    { file: "/media/img_021.webp", caption: "鎷夊彇鍔ㄤ綔搴忓垪甯? },
    { file: "/media/img_022.webp", caption: "鍙岃噦鎷夊彇鐗╀綋瀹屾垚甯? },
  ],
  // 鏍″噯 (A)锛氭墜鎸囧叧鑺?婵€鍏夎瑙夋牎鍑?
  calibrate: [
    { file: "/media/img_024.webp", caption: "鐧借壊鏈烘鎵嬫墽琛屾墜鎸囨牎鍑? },
    { file: "/media/img_025.webp", caption: "鏍″噯椋熸寚鍏宠妭鍔ㄤ綔甯? },
    { file: "/media/img_026.webp", caption: "鏍″噯涓寚鍏宠妭鍔ㄤ綔甯? },
    { file: "/media/img_027.webp", caption: "鏍″噯鏃犲悕鎸囧叧鑺傚姩浣滃抚" },
  ],
  // 鍒嗗紑 (A)锛氬皢鍙犳斁鎴栫矘杩炵殑鐗╀綋鍒嗙
  separate: [
    { file: "/media/img_032.webp", caption: "榛戣壊澶圭埅鍦ㄦ墦瀛斿彴鍒嗙鐗╀綋" },
    { file: "/media/img_096.webp", caption: "鍙屾墜鍗忎綔鍒嗗紑鍙犳斁鐨勯鐩? },
    { file: "/media/img_097.webp", caption: "鍒嗗紑鍔ㄤ綔瀹屾垚甯? },
  ],
  // 鎶涘嚭 (A)锛氬皢鐗╀綋鎶涙幏鍒扮洰鏍囧尯鍩?
  toss: [
    { file: "/media/img_165.webp", caption: "鎵撳瓟鍙颁笂鎶涘嚭妗冨瓙鐨勭灛闂村抚" },
    { file: "/media/img_033.webp", caption: "鍗曡噦鏈哄櫒浜烘墽琛屾姏鍑哄姩浣? },
  ],
  // 澶瑰彇 (A)锛氱ǔ瀹氬す鎸佺壒瀹氬舰鐘剁墿浣?
  clamp: [
    { file: "/media/img_034.webp", caption: "澶圭埅绋冲畾澶规寔绾告澂" },
    { file: "/media/img_099.webp", caption: "鏈烘鎵嬪す鍙栧渾鏌卞舰鐗╀綋" },
  ],
  // 杞姩 (A)锛氭棆杞垨缈昏浆鐗╀綋
  turn: [
    { file: "/media/img_036.webp", caption: "鏈烘鎵嬫棆杞渾褰㈢洰鏍囩墿" },
    { file: "/media/img_100.webp", caption: "杞姩鍔ㄤ綔鎵ц杩囩▼甯? },
  ],
};

// 鈹€鈹€ 瑙嗛鍒嗙粍锛坴id_000~vid_012锛屾寜鏂囦欢鍚嶅姩浣滅被鍨嬶級鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€
// vid_000~001: pick, vid_002~003: place, vid_004~005: push
// vid_006: push, vid_007~008: pick, vid_009~010: place, vid_011: push, vid_012: push
const SKILL_VIDEOS: Record<string, { file: string; caption: string }[]> = {
  pick:  [
    { file: "/media/vid_000.mp4", caption: "鎷惧彇鍔ㄤ綔瑙嗛绀轰緥 1" },
    { file: "/media/vid_001.mp4", caption: "鎷惧彇鍔ㄤ綔瑙嗛绀轰緥 2" },
    { file: "/media/vid_007.mp4", caption: "鎷惧彇鍔ㄤ綔瑙嗛绀轰緥 3" },
    { file: "/media/vid_008.mp4", caption: "鎷惧彇鍔ㄤ綔瑙嗛绀轰緥 4" },
  ],
  place: [
    { file: "/media/vid_002.mp4", caption: "鏀剧疆鍔ㄤ綔瑙嗛绀轰緥 1" },
    { file: "/media/vid_003.mp4", caption: "鏀剧疆鍔ㄤ綔瑙嗛绀轰緥 2" },
    { file: "/media/vid_009.mp4", caption: "鏀剧疆鍔ㄤ綔瑙嗛绀轰緥 3" },
    { file: "/media/vid_010.mp4", caption: "鏀剧疆鍔ㄤ綔瑙嗛绀轰緥 4" },
  ],
  push:  [
    { file: "/media/vid_004.mp4", caption: "鎺ㄥ姩鍔ㄤ綔瑙嗛绀轰緥 1" },
    { file: "/media/vid_005.mp4", caption: "鎺ㄥ姩鍔ㄤ綔瑙嗛绀轰緥 2" },
    { file: "/media/vid_006.mp4", caption: "鎺ㄥ姩鍔ㄤ綔瑙嗛绀轰緥 3" },
    { file: "/media/vid_011.mp4", caption: "鎺ㄥ姩鍔ㄤ綔瑙嗛绀轰緥 4" },
    { file: "/media/vid_012.mp4", caption: "鎺ㄥ姩鍔ㄤ綔瑙嗛绀轰緥 5" },
  ],
};

const SKILL_ORDER = ["pick", "place", "transfer", "push", "move", "insert", "pull", "calibrate", "separate", "toss", "clamp", "turn"];

interface Skill { id: string; key: string; }

// 鈹€鈹€ 鍥剧墖鍗＄墖 鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€
const ImgCard = ({
  file, caption, studioUrl, onClick,
}: {
  file: string;
  caption: string;
  studioUrl?: string;
  onClick: () => void;
}) => {
  const handleClick = () => {
    if (studioUrl) {
      window.open(studioUrl, "_blank", "noopener,noreferrer");
    } else {
      onClick();
    }
  };

  return (
    <div
      onClick={handleClick}
      style={{
        borderRadius: 6, overflow: "hidden",
        cursor: studioUrl ? "pointer" : "zoom-in",
        boxShadow: "0 2px 8px rgba(0,0,0,0.10)", background: "#111",
        transition: "transform 0.15s, box-shadow 0.15s",
        position: "relative",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.transform = "translateY(-2px)";
        (e.currentTarget as HTMLDivElement).style.boxShadow = "0 6px 18px rgba(0,0,0,0.18)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.transform = "";
        (e.currentTarget as HTMLDivElement).style.boxShadow = "0 2px 8px rgba(0,0,0,0.10)";
      }}
    >
      <img
        src={file}
        alt={caption}
        style={{ display: "block", width: "100%", height: 200, objectFit: "cover" }}
        loading="lazy"
      />
      {studioUrl && (
        <div style={{
          position: "absolute", top: 8, right: 8,
          background: "rgba(37,99,235,0.85)", borderRadius: 4,
          padding: "2px 8px", display: "flex", alignItems: "center", gap: 4,
          color: "#fff", fontSize: 12, pointerEvents: "none",
        }}>
          <LinkOutlined style={{ fontSize: 11 }} />
          鍦?Studio 涓煡鐪?
        </div>
      )}
      <div style={{ padding: "10px 14px", fontSize: 13, color: "#444", background: "#fff", lineHeight: 1.5 }}>
        {caption}
      </div>
    </div>
  );
};

// 鈹€鈹€ 瑙嗛鍗＄墖 鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€
const VidCard = ({ file, caption }: { file: string; caption: string }) => (
  <div style={{ borderRadius: 6, overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.10)", background: "#111" }}>
    <video src={file} controls
      style={{ display: "block", width: "100%", height: 200, objectFit: "cover", background: "#111" }} />
    <div style={{ padding: "10px 14px", fontSize: 13, color: "#444", background: "#fff", lineHeight: 1.5 }}>
      <PlayCircleOutlined style={{ marginRight: 6, color: "#2563eb" }} />
      {caption}
    </div>
  </div>
);

// 鈹€鈹€ 涓婚〉闈?鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€
const SkillsPage = () => {
  const [skills, setSkills] = useState<Skill[]>(
    SKILL_ORDER.map((k) => ({ id: k, key: k }))
  );
  const [keyword, setKeyword] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [lightbox, setLightbox] = useState<string | null>(null);
  const [showVideos, setShowVideos] = useState<Record<string, boolean>>({});
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const filtered = skills.filter((s) => {
    const zh = ACTION_ZH[s.key] ?? s.key;
    return !keyword || zh.includes(keyword) || s.key.includes(keyword.toLowerCase());
  });

  const handleCreate = () => {
    if (!newTitle.trim()) { message.warning("璇疯緭鍏ユ妧鑳藉悕绉?); return; }
    const key = `custom_${Date.now()}`;
    setSkills([...skills, { id: key, key }]);
    // 娉ㄥ叆鑷畾涔夊悕绉?
    ACTION_ZH[key] = newTitle;
    ACTION_COUNT[key] = 0;
    message.success("鎶€鑳藉凡鍒涘缓");
    setCreateOpen(false);
    setNewTitle("");
  };

  const handleDelete = (id: string) => {
    setSkills(skills.filter((s) => s.id !== id));
    message.success("宸插垹闄?);
  };

  return (
    <section className="platform-page skills-page">
      {/* 椤堕儴宸ュ叿鏍?*/}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", minHeight: 64, borderBottom: "1px solid #f0f2f5", marginBottom: 4 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <h2 style={{ margin: 0, fontSize: 18, fontWeight: 600 }}>
            璁粌鎶€鑳?
            <span style={{ color: "#888", fontWeight: 400, fontSize: 14, marginLeft: 8 }}>{skills.length} 绉?/span>
          </h2>
          <Input prefix={<SearchOutlined />} placeholder="鎼滅储鎶€鑳? value={keyword}
            onChange={(e) => setKeyword(e.target.value)} style={{ width: 200 }} allowClear />
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <Button icon={<PlusOutlined />} type="primary" onClick={() => setCreateOpen(true)}>鏂板缓鎶€鑳?/Button>
          <Button icon={<FullscreenOutlined />} onClick={() => document.documentElement.requestFullscreen?.()}>鍏ㄥ睆</Button>
        </div>
      </div>

      {/* 鎶€鑳藉垪琛?*/}
      {filtered.map((skill) => {
        const zh = ACTION_ZH[skill.key] ?? skill.key;
        const count = ACTION_COUNT[skill.key] ?? 0;
        const imgs = SKILL_IMAGES[skill.key] ?? [];
        const vids = SKILL_VIDEOS[skill.key] ?? [];
        const studioUrl = SKILL_STUDIO_URL[skill.key];
        const isVideo = showVideos[skill.key];
        const isExpanded = expanded[skill.key];
        const media = isVideo ? vids : imgs;
        const displayMedia = isExpanded ? media : media.slice(0, 3);

        return (
          <section key={skill.id} style={{ padding: "28px 0 32px", borderBottom: "1px solid #f0f2f5" }}>
            {/* 鏍囬琛?*/}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <h3 style={{ margin: 0, fontSize: 17, fontWeight: 600 }}>{zh}</h3>
                <Tag color="blue" style={{ fontSize: 12 }}>{count}</Tag>
                {vids.length > 0 && (
                  <Button size="small" type={isVideo ? "primary" : "default"} icon={<PlayCircleOutlined />}
                    onClick={() => setShowVideos((p) => ({ ...p, [skill.key]: !p[skill.key] }))}>
                    {isVideo ? "鍥剧墖" : `瑙嗛 (${vids.length})`}
                  </Button>
                )}
              </div>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                {studioUrl && (
                  <Tooltip title="鍦?Studio 涓煡鐪嬫暟鎹泦">
                    <Button
                      size="small"
                      type="primary"
                      ghost
                      icon={<LinkOutlined />}
                      onClick={() => window.open(studioUrl, "_blank", "noopener,noreferrer")}
                    >
                      Studio
                    </Button>
                  </Tooltip>
                )}
                {media.length > 3 && (
                  <Button size="small" type="link" icon={<RightOutlined />}
                    onClick={() => setExpanded((p) => ({ ...p, [skill.key]: !p[skill.key] }))}>
                    {isExpanded ? "鏀惰捣" : `鏌ョ湅鍏ㄩ儴 ${media.length}`}
                  </Button>
                )}
                <Button size="small" type="link" danger onClick={() => handleDelete(skill.id)}>鍒犻櫎</Button>
              </div>
            </div>

            {/* 濯掍綋缃戞牸 */}
            {displayMedia.length > 0 ? (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
                {displayMedia.map((m) =>
                  isVideo
                    ? <VidCard key={m.file} file={m.file} caption={m.caption} />
                    : <ImgCard key={m.file} file={m.file} caption={m.caption} studioUrl={studioUrl} onClick={() => setLightbox(m.file)} />
                )}
              </div>
            ) : (
              <div style={{ color: "#bbb", fontSize: 13, padding: "16px 0" }}>鏆傛棤绀轰緥鏁版嵁</div>
            )}
          </section>
        );
      })}

      {filtered.length === 0 && (
        <div style={{ textAlign: "center", color: "#bbb", padding: "60px 0", fontSize: 15 }}>娌℃湁鎵惧埌鍖归厤鐨勬妧鑳?/div>
      )}

      {/* 鏂板缓鎶€鑳藉脊绐?*/}
      <Modal title="鏂板缓鎶€鑳? open={createOpen}
        onOk={handleCreate} onCancel={() => { setCreateOpen(false); setNewTitle(""); }}
        okText="鍒涘缓" cancelText="鍙栨秷">
        <Input placeholder="鎶€鑳藉悕绉帮紙濡傦細浠?{B} 鎹¤捣 {A}锛? value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)} style={{ marginTop: 12 }} />
      </Modal>

      {/* 鐏 */}
      {lightbox && (
        <div onClick={() => setLightbox(null)} style={{
          position: "fixed", inset: 0, zIndex: 1000,
          background: "rgba(0,0,0,0.88)",
          display: "flex", alignItems: "center", justifyContent: "center", cursor: "zoom-out",
        }}>
          <img src={lightbox} alt="preview"
            style={{ maxWidth: "90vw", maxHeight: "90vh", borderRadius: 4, objectFit: "contain" }} />
        </div>
      )}
    </section>
  );
};

export default SkillsPage;
