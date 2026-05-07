#ifndef UNICODE
#define UNICODE
#endif
#ifndef _UNICODE
#define _UNICODE
#endif
#ifndef WINVER
#define WINVER 0x0600
#endif
#ifndef _WIN32_WINNT
#define _WIN32_WINNT 0x0600
#endif

#include <windows.h>

#include <algorithm>
#include <cmath>
#include <cwchar>
#include <fstream>
#include <iomanip>
#include <map>
#include <sstream>
#include <string>
#include <vector>

namespace {

constexpr int kWindowWidth = 1080;
constexpr int kWindowHeight = 900;
constexpr int kMargin = 20;
constexpr int kPanelWidth = 500;
constexpr int kRowHeight = 34;
constexpr int kLabelWidth = 150;
constexpr int kEditWidth = 110;
constexpr int kComboWidth = 220;
constexpr int kSuffixWidth = 70;
constexpr int kPanelTop = 120;

constexpr int kCalculateButtonId = 5001;
constexpr int kOutputId = 5002;
constexpr int kPhaseComboId = 5003;
constexpr int kBackrowArtilleryId = 5004;

constexpr const char* kUnitPipsPath = "E:\\ai_project\\docx_for_ai\\eu4_unit_pips_complete.md";

enum class Side {
    Attacker = 0,
    Defender = 1
};

enum class UnitType {
    Infantry = 0,
    Cavalry = 1,
    Artillery = 2
};

enum class CombatPhase {
    Fire = 0,
    Shock = 1
};

struct TechStats {
    double infantryFire;
    double cavalryFire;
    double artilleryFire;
    double infantryShock;
    double cavalryShock;
    double artilleryShock;
    double militaryTactics;
};

struct UnitEntry {
    std::wstring group;
    UnitType unitType;
    int techLevel;
    std::wstring unitName;
    int fireOff;
    int fireDef;
    int shockOff;
    int shockDef;
};

struct CommonField {
    int id;
    const wchar_t* label;
    const wchar_t* initialValue;
    const wchar_t* suffix;
    int x;
    int y;
    HWND edit = nullptr;
};

struct SideField {
    int id;
    const wchar_t* label;
    const wchar_t* initialValue;
    const wchar_t* suffix;
    int row;
    HWND edit = nullptr;
};

struct SideControls {
    HWND groupCombo = nullptr;
    HWND unitTypeCombo = nullptr;
    HWND unitCombo = nullptr;
    std::vector<SideField> fields;
};

struct SideInput {
    std::wstring group;
    UnitType unitType;
    const UnitEntry* unit = nullptr;
    double techLevel = 0.0;
    double strength = 0.0;
    double combatAbility = 0.0;
    double discipline = 0.0;
    double extraMilitaryTactics = 0.0;
    double damageDone = 0.0;
    double damageTaken = 0.0;
};

enum CommonFieldId {
    DiceId = 1001,
    LeaderDiffId,
    TerrainPenaltyId
};

enum SideFieldId {
    TechLevelId = 2001,
    StrengthId,
    CombatAbilityId,
    DisciplineId,
    ExtraMilitaryTacticsId,
    DamageDoneId,
    DamageTakenId
};

HWND g_output = nullptr;
HWND g_phaseCombo = nullptr;
HWND g_backrowArtillery = nullptr;
SideControls g_attacker;
SideControls g_defender;
std::vector<CommonField> g_commonFields;

std::vector<UnitEntry> g_unitEntries;
std::vector<std::wstring> g_unitGroups;
std::wstring g_unitDataError;

const std::map<std::wstring, std::wstring> kGroupTranslations = {
    {L"Western", L"西欧"},
    {L"Eastern", L"东欧"},
    {L"Anatolian (Ottoman)", L"安纳托利亚（奥斯曼）"},
    {L"Muslim", L"穆斯林"},
    {L"Indian", L"印度"},
    {L"Chinese", L"中华"},
    {L"Nomadic", L"游牧"},
    {L"African Groups (Central / East / West African)", L"非洲组（中非/东非/西非）"},
    {L"Aboriginal", L"原住民"},
    {L"High American (Fantasy / Inca)", L"高美洲（幻想/印加）"},
    {L"Native American Groups", L"美洲原住民组"},
    {L"Polynesian", L"波利尼西亚"},
    {L"Shared", L"通用"}
};

const std::map<std::wstring, std::wstring> kUnitTranslations = {
    {L"Houfnice", L"胡夫尼采火炮"},
    {L"Large Cast Bronze Mortar", L"大型铸铜迫击炮"},
    {L"Culverin", L"长炮"},
    {L"Pedrero", L"佩德雷罗炮"},
    {L"Large Cast Iron Cannon", L"大型铸铁炮"},
    {L"Small Cast Iron Cannon", L"小型铸铁炮"},
    {L"Chambered Demi Cannon", L"后装半加农炮"},
    {L"Demi-Culverin", L"半长炮"},
    {L"Leather Cannon", L"皮制火炮"},
    {L"Chambered Cannon", L"后装加农炮"},
    {L"Swivel Cannon", L"回旋炮"},
    {L"Howitzer", L"榴弹炮"},
    {L"Coehorn Mortar", L"库霍恩迫击炮"},
    {L"Horse Artillery", L"骑马炮兵"},
    {L"Royal Mortar", L"皇家迫击炮"},
    {L"Licorne", L"独角兽炮"},
    {L"Flying Battery", L"机动炮兵连"},
    {L"Grand Battery", L"大炮兵连"},
    {L"Halberd Infantry", L"戟兵"},
    {L"Latin Medieval Infantry", L"拉丁中世纪步兵"},
    {L"Galloglaigh Infantry", L"盖洛格拉斯步兵"},
    {L"Longbow", L"长弓兵"},
    {L"Men at Arms", L"披甲兵"},
    {L"Condotta Infantry", L"孔多塔步兵"},
    {L"Landsknecht Infantry", L"兰茨克内希特步兵"},
    {L"Reformed Galloglaigh Infantry", L"改良盖洛格拉斯步兵"},
    {L"Free Shooter Infantry", L"自由射手步兵"},
    {L"Tercio Infantry", L"大方阵步兵"},
    {L"Charge Infantry", L"冲锋步兵"},
    {L"Maurician Infantry", L"毛里茨步兵"},
    {L"Gustavian Infantry", L"古斯塔夫步兵"},
    {L"Highlanders Infantry", L"高地步兵"},
    {L"Reformed Tercio", L"改良大方阵"},
    {L"Caroline Infantry", L"卡洛林步兵"},
    {L"Grenzer Infantry", L"边境兵"},
    {L"Line Infantry", L"线列步兵"},
    {L"Blue Coat Infantry", L"蓝衣步兵"},
    {L"Frederickian Infantry", L"腓特烈步兵"},
    {L"Redcoat Infantry", L"红衣步兵"},
    {L"White Coat Infantry", L"白衣步兵"},
    {L"Impulse Infantry", L"突击步兵"},
    {L"Square Infantry", L"方阵步兵"},
    {L"Drill Infantry", L"操典步兵"},
    {L"Jager Infantry", L"猎兵"},
    {L"Mixed Order Infantry", L"混合序列步兵"},
    {L"Napoleonic Square", L"拿破仑方阵"}
};

constexpr TechStats kMilTechStats[33] = {
    {0.25, 0.00, 0.00, 0.20, 0.80, 0.00, 0.50},
    {0.35, 0.00, 0.00, 0.30, 0.80, 0.00, 0.50},
    {0.35, 0.00, 0.00, 0.50, 1.00, 0.00, 0.50},
    {0.35, 0.00, 0.00, 0.50, 1.00, 0.00, 0.50},
    {0.35, 0.00, 0.00, 0.50, 1.00, 0.00, 0.75},
    {0.35, 0.00, 0.00, 0.65, 1.20, 0.00, 0.75},
    {0.55, 0.00, 0.00, 0.95, 1.20, 0.00, 1.00},
    {0.55, 0.00, 1.00, 0.95, 1.20, 0.05, 1.25},
    {0.80, 0.00, 1.00, 0.95, 2.00, 0.05, 1.25},
    {0.80, 0.00, 1.00, 0.95, 2.00, 0.05, 1.50},
    {0.80, 0.00, 1.00, 0.95, 2.00, 0.05, 1.50},
    {0.80, 0.50, 1.00, 1.15, 2.00, 0.05, 1.50},
    {0.80, 0.50, 1.00, 1.15, 2.00, 0.05, 1.75},
    {0.80, 0.50, 1.40, 1.15, 2.00, 0.15, 1.75},
    {1.10, 0.50, 1.40, 1.15, 2.00, 0.15, 1.75},
    {1.10, 0.50, 1.40, 1.15, 2.00, 0.15, 2.00},
    {1.10, 0.50, 2.40, 1.15, 2.00, 0.25, 2.00},
    {1.10, 0.50, 2.40, 1.15, 3.00, 0.25, 2.00},
    {1.10, 0.50, 2.40, 1.15, 3.00, 0.25, 2.00},
    {1.10, 0.50, 2.40, 1.15, 3.00, 0.25, 2.25},
    {1.60, 0.50, 2.40, 1.15, 3.00, 0.25, 2.25},
    {1.60, 0.50, 2.40, 1.65, 3.00, 0.25, 2.50},
    {1.60, 1.00, 4.40, 1.65, 3.00, 0.35, 2.50},
    {1.60, 1.00, 4.40, 1.65, 4.00, 0.35, 2.75},
    {1.60, 1.00, 4.40, 1.65, 4.00, 0.35, 3.00},
    {1.60, 1.00, 6.40, 1.65, 4.00, 0.45, 3.00},
    {1.60, 1.00, 6.40, 1.65, 4.00, 0.45, 3.00},
    {2.10, 1.00, 6.40, 1.65, 4.00, 0.45, 3.00},
    {2.10, 1.00, 6.40, 2.15, 4.00, 0.45, 3.00},
    {2.10, 1.00, 6.40, 2.15, 4.00, 0.45, 3.00},
    {2.10, 1.00, 6.40, 2.15, 4.00, 0.45, 3.25},
    {3.10, 1.00, 6.40, 2.15, 5.00, 0.45, 3.25},
    {3.10, 1.00, 8.40, 2.15, 5.00, 0.55, 3.50}
};

std::wstring Trim(const std::wstring& value)
{
    const size_t start = value.find_first_not_of(L" \t\r\n");
    if (start == std::wstring::npos) {
        return L"";
    }
    const size_t end = value.find_last_not_of(L" \t\r\n");
    return value.substr(start, end - start + 1);
}

std::wstring TranslateGroupName(const std::wstring& group)
{
    const auto it = kGroupTranslations.find(group);
    return it == kGroupTranslations.end() ? group : it->second;
}

std::wstring TranslateUnitName(const std::wstring& unitName)
{
    const auto it = kUnitTranslations.find(unitName);
    return it == kUnitTranslations.end() ? unitName : it->second;
}

const wchar_t* SideLabel(Side side)
{
    return side == Side::Attacker ? L"进攻方" : L"防守方";
}

int SideX(Side side)
{
    return side == Side::Attacker ? kMargin : (kMargin * 2 + kPanelWidth);
}

std::vector<std::wstring> SplitMarkdownRow(const std::wstring& line)
{
    std::vector<std::wstring> cells;
    std::wstring current;
    for (wchar_t ch : line) {
        if (ch == L'|') {
            cells.push_back(Trim(current));
            current.clear();
        } else {
            current.push_back(ch);
        }
    }
    cells.push_back(Trim(current));
    if (!cells.empty() && cells.front().empty()) {
        cells.erase(cells.begin());
    }
    if (!cells.empty() && cells.back().empty()) {
        cells.pop_back();
    }
    return cells;
}

bool IsDividerRow(const std::vector<std::wstring>& cells)
{
    if (cells.empty()) {
        return false;
    }
    for (const auto& cell : cells) {
        for (wchar_t ch : cell) {
            if (ch != L':' && ch != L'-' && ch != L' ') {
                return false;
            }
        }
    }
    return true;
}

bool LoadUnitData()
{
    std::ifstream input(kUnitPipsPath);
    if (!input.is_open()) {
        g_unitDataError = L"无法读取兵种点数文件：eu4_unit_pips_complete.md";
        return false;
    }

    std::string rawLine;
    std::wstring currentGroup;
    UnitType currentUnitType = UnitType::Infantry;
    bool hasUnitType = false;

    while (std::getline(input, rawLine)) {
        std::wstring line(rawLine.begin(), rawLine.end());
        line = Trim(line);
        if (line.empty()) {
            continue;
        }

        if (line.rfind(L"## ", 0) == 0) {
            const size_t dotPos = line.find(L". ");
            std::wstring heading = dotPos == std::wstring::npos ? line.substr(3) : line.substr(dotPos + 2);
            if (heading.find(L"Artillery") != std::wstring::npos) {
                currentGroup = L"Shared";
                currentUnitType = UnitType::Artillery;
                hasUnitType = true;
            } else {
                currentGroup = heading;
                hasUnitType = false;
            }
            continue;
        }

        if (line.rfind(L"### ", 0) == 0) {
            if (line.find(L"Infantry") != std::wstring::npos) {
                currentUnitType = UnitType::Infantry;
                hasUnitType = true;
            } else if (line.find(L"Cavalry") != std::wstring::npos) {
                currentUnitType = UnitType::Cavalry;
                hasUnitType = true;
            } else if (line.find(L"Artillery") != std::wstring::npos) {
                currentUnitType = UnitType::Artillery;
                hasUnitType = true;
            }
            continue;
        }

        if (line.front() != L'|' || !hasUnitType) {
            continue;
        }

        std::vector<std::wstring> cells = SplitMarkdownRow(line);
        if (cells.size() < 8 || cells[0] == L"Tech" || IsDividerRow(cells)) {
            continue;
        }

        UnitEntry entry = {};
        entry.group = currentGroup;
        entry.unitType = currentUnitType;
        entry.techLevel = std::stoi(cells[0]);
        entry.unitName = cells[1];
        entry.fireOff = std::stoi(cells[2]);
        entry.fireDef = std::stoi(cells[3]);
        entry.shockOff = std::stoi(cells[4]);
        entry.shockDef = std::stoi(cells[5]);
        g_unitEntries.push_back(entry);
    }

    for (const auto& entry : g_unitEntries) {
        if (entry.group == L"Shared") {
            continue;
        }
        if (std::find(g_unitGroups.begin(), g_unitGroups.end(), entry.group) == g_unitGroups.end()) {
            g_unitGroups.push_back(entry.group);
        }
    }

    if (g_unitEntries.empty() || g_unitGroups.empty()) {
        g_unitDataError = L"兵种点数文件内容为空或格式无法识别。";
        return false;
    }
    return true;
}

double LookupTechModifier(int milTechLevel, UnitType unitType, CombatPhase phase)
{
    const TechStats& stats = kMilTechStats[milTechLevel];
    if (phase == CombatPhase::Fire) {
        if (unitType == UnitType::Infantry) {
            return stats.infantryFire;
        }
        if (unitType == UnitType::Cavalry) {
            return stats.cavalryFire;
        }
        return stats.artilleryFire;
    }

    if (unitType == UnitType::Infantry) {
        return stats.infantryShock;
    }
    if (unitType == UnitType::Cavalry) {
        return stats.cavalryShock;
    }
    return stats.artilleryShock;
}

double LookupBaseMilitaryTactics(int milTechLevel)
{
    return kMilTechStats[milTechLevel].militaryTactics;
}

std::wstring GetWindowTextString(HWND window)
{
    const int length = GetWindowTextLengthW(window);
    std::wstring text(static_cast<size_t>(length) + 1, L'\0');
    if (length > 0) {
        GetWindowTextW(window, &text[0], length + 1);
    }
    text.resize(static_cast<size_t>(length));
    return text;
}

bool ReadDouble(HWND edit, const wchar_t* label, double& value, std::wstring& error)
{
    const std::wstring text = GetWindowTextString(edit);
    wchar_t* end = nullptr;
    value = std::wcstod(text.c_str(), &end);
    while (end != nullptr && *end == L' ') {
        ++end;
    }

    if (text.empty() || end == text.c_str() || (end != nullptr && *end != L'\0') || !std::isfinite(value)) {
        error = std::wstring(L"请输入有效数字：") + label;
        return false;
    }
    return true;
}

bool ReadInt(HWND edit, const wchar_t* label, int& value, std::wstring& error)
{
    double temp = 0.0;
    if (!ReadDouble(edit, label, temp, error)) {
        return false;
    }
    if (std::floor(temp) != temp) {
        error = std::wstring(label) + L" 请输入整数。";
        return false;
    }
    value = static_cast<int>(temp);
    return true;
}

HWND CreateChild(HWND parent,
                 const wchar_t* className,
                 const wchar_t* text,
                 DWORD style,
                 int x,
                 int y,
                 int width,
                 int height,
                 int id = 0,
                 DWORD extendedStyle = 0)
{
    return CreateWindowExW(extendedStyle,
                           className,
                           text,
                           WS_CHILD | WS_VISIBLE | style,
                           x,
                           y,
                           width,
                           height,
                           parent,
                           reinterpret_cast<HMENU>(static_cast<INT_PTR>(id)),
                           GetModuleHandleW(nullptr),
                           nullptr);
}

void InitializeSideFields(SideControls& controls)
{
    controls.fields = {
        {TechLevelId, L"军事科技", L"3", L"0-32", 0},
        {StrengthId, L"参战兵力", L"1000", L"人", 1},
        {CombatAbilityId, L"作战能力", L"0", L"%", 5},
        {DisciplineId, L"训练度/纪律", L"0", L"%", 6},
        {ExtraMilitaryTacticsId, L"额外军事战术", L"0", L"", 7},
        {DamageDoneId, L"造成伤害修正", L"0", L"%", 8},
        {DamageTakenId, L"承受伤害修正", L"0", L"%", 9}
    };
}

SideField* FindSideField(SideControls& controls, int id)
{
    for (auto& field : controls.fields) {
        if (field.id == id) {
            return &field;
        }
    }
    return nullptr;
}

std::vector<const UnitEntry*> GetSelectableUnits(const std::wstring& group, UnitType unitType, int techLevel)
{
    std::vector<const UnitEntry*> matches;
    int activeTechLevel = -1;

    for (const auto& entry : g_unitEntries) {
        const bool groupMatch = (unitType == UnitType::Artillery) ? (entry.group == L"Shared") : (entry.group == group);
        if (!groupMatch || entry.unitType != unitType || entry.techLevel > techLevel) {
            continue;
        }

        if (entry.techLevel > activeTechLevel) {
            activeTechLevel = entry.techLevel;
            matches.clear();
        }
        if (entry.techLevel == activeTechLevel) {
            matches.push_back(&entry);
        }
    }
    return matches;
}

const UnitEntry* FindSelectedUnit(HWND combo)
{
    const LRESULT selected = SendMessageW(combo, CB_GETCURSEL, 0, 0);
    if (selected == CB_ERR) {
        return nullptr;
    }
    return reinterpret_cast<const UnitEntry*>(SendMessageW(combo, CB_GETITEMDATA, static_cast<WPARAM>(selected), 0));
}

void PopulateComboWithUnits(HWND combo, const std::vector<const UnitEntry*>& units)
{
    SendMessageW(combo, CB_RESETCONTENT, 0, 0);
    for (const UnitEntry* unit : units) {
        const std::wstring displayName = TranslateUnitName(unit->unitName);
        const LRESULT index = SendMessageW(combo, CB_ADDSTRING, 0, reinterpret_cast<LPARAM>(displayName.c_str()));
        SendMessageW(combo, CB_SETITEMDATA, static_cast<WPARAM>(index), reinterpret_cast<LPARAM>(unit));
    }
    if (!units.empty()) {
        SendMessageW(combo, CB_SETCURSEL, 0, 0);
    }
}

void UpdateSideUnitCombo(SideControls& controls)
{
    if (controls.groupCombo == nullptr || controls.unitTypeCombo == nullptr || controls.unitCombo == nullptr) {
        return;
    }

    const LRESULT groupIndex = SendMessageW(controls.groupCombo, CB_GETCURSEL, 0, 0);
    const LRESULT unitTypeIndex = SendMessageW(controls.unitTypeCombo, CB_GETCURSEL, 0, 0);
    if (groupIndex == CB_ERR || unitTypeIndex == CB_ERR || groupIndex < 0 ||
        groupIndex >= static_cast<LRESULT>(g_unitGroups.size())) {
        return;
    }

    SideField* techField = FindSideField(controls, TechLevelId);
    int techLevel = 0;
    std::wstring ignoredError;
    if (techField == nullptr || !ReadInt(techField->edit, techField->label, techLevel, ignoredError)) {
        SendMessageW(controls.unitCombo, CB_RESETCONTENT, 0, 0);
        return;
    }

    const std::wstring& group = g_unitGroups[static_cast<size_t>(groupIndex)];
    const UnitType unitType = static_cast<UnitType>(unitTypeIndex);
    PopulateComboWithUnits(controls.unitCombo, GetSelectableUnits(group, unitType, techLevel));
}

void UpdateAllUnitCombos()
{
    UpdateSideUnitCombo(g_attacker);
    UpdateSideUnitCombo(g_defender);
}

double PercentMultiplier(double percent)
{
    return 1.0 + percent / 100.0;
}

void SetText(HWND window, const std::wstring& text)
{
    SetWindowTextW(window, text.c_str());
}

bool ReadSideInput(Side side, SideControls& controls, SideInput& input, std::wstring& error)
{
    const LRESULT groupIndex = SendMessageW(controls.groupCombo, CB_GETCURSEL, 0, 0);
    const LRESULT unitTypeIndex = SendMessageW(controls.unitTypeCombo, CB_GETCURSEL, 0, 0);
    if (groupIndex == CB_ERR || unitTypeIndex == CB_ERR || groupIndex < 0 ||
        groupIndex >= static_cast<LRESULT>(g_unitGroups.size())) {
        error = std::wstring(L"请选择") + SideLabel(side) + L"的兵种组和兵种类型。";
        return false;
    }

    input.group = g_unitGroups[static_cast<size_t>(groupIndex)];
    input.unitType = static_cast<UnitType>(unitTypeIndex);
    input.unit = FindSelectedUnit(controls.unitCombo);
    if (input.unit == nullptr) {
        error = std::wstring(SideLabel(side)) + L"当前没有可用兵种，请检查军科和兵种组。";
        return false;
    }

    auto readField = [&](int fieldId, double& outValue) -> bool {
        SideField* field = FindSideField(controls, fieldId);
        return field != nullptr && ReadDouble(field->edit, field->label, outValue, error);
    };

    if (!readField(TechLevelId, input.techLevel) ||
        !readField(StrengthId, input.strength) ||
        !readField(CombatAbilityId, input.combatAbility) ||
        !readField(DisciplineId, input.discipline) ||
        !readField(ExtraMilitaryTacticsId, input.extraMilitaryTactics) ||
        !readField(DamageDoneId, input.damageDone) ||
        !readField(DamageTakenId, input.damageTaken)) {
        return false;
    }

    if (input.techLevel < 0.0 || input.techLevel > 32.0 || std::floor(input.techLevel) != input.techLevel) {
        error = std::wstring(SideLabel(side)) + L"的军事科技应为 0 到 32 的整数。";
        return false;
    }
    if (input.strength < 0.0) {
        error = std::wstring(SideLabel(side)) + L"的参战兵力不能为负数。";
        return false;
    }
    if (PercentMultiplier(input.combatAbility) < 0.0 ||
        PercentMultiplier(input.discipline) < 0.0 ||
        PercentMultiplier(input.damageDone) < 0.0 ||
        PercentMultiplier(input.damageTaken) < 0.0) {
        error = std::wstring(SideLabel(side)) + L"的百分比修正不能让乘数低于 0。";
        return false;
    }

    return true;
}

struct DamageBreakdown {
    double baseCasualties = 0.0;
    double techModifier = 0.0;
    double defenderTactics = 0.0;
    double finalDamage = 0.0;
    double attackerPips = 0.0;
    double defenderPips = 0.0;
};

DamageBreakdown ComputeOneWayDamage(const SideInput& attacker,
                                    const SideInput& defender,
                                    CombatPhase phase,
                                    double dice,
                                    double leaderDiff,
                                    double terrainPenalty,
                                    bool isBackrowArtillery)
{
    DamageBreakdown result = {};
    result.attackerPips = (phase == CombatPhase::Fire) ? attacker.unit->fireOff : attacker.unit->shockOff;
    result.defenderPips = (phase == CombatPhase::Fire) ? defender.unit->fireDef : defender.unit->shockDef;

    const double rawBase = 15.0 + 5.0 * (dice + leaderDiff + result.attackerPips - result.defenderPips - terrainPenalty);
    result.baseCasualties = std::max(15.0, rawBase);

    result.techModifier = LookupTechModifier(static_cast<int>(attacker.techLevel), attacker.unitType, phase);
    result.defenderTactics = (LookupBaseMilitaryTactics(static_cast<int>(defender.techLevel)) + defender.extraMilitaryTactics) *
                             PercentMultiplier(defender.discipline);

    double multiplier = (attacker.strength / 1000.0) *
                        (result.techModifier / result.defenderTactics) *
                        PercentMultiplier(attacker.combatAbility) *
                        PercentMultiplier(attacker.discipline) *
                        PercentMultiplier(attacker.damageDone) *
                        PercentMultiplier(defender.damageTaken);

    if (isBackrowArtillery && attacker.unitType == UnitType::Artillery) {
        multiplier *= 0.5;
    }

    result.finalDamage = result.baseCasualties * multiplier;
    return result;
}

void CalculateDamage()
{
    if (!g_unitDataError.empty()) {
        SetText(g_output, g_unitDataError);
        return;
    }

    std::wstring error;
    double dice = 0.0;
    double leaderDiff = 0.0;
    double terrainPenalty = 0.0;

    if (!ReadDouble(g_commonFields[0].edit, g_commonFields[0].label, dice, error) ||
        !ReadDouble(g_commonFields[1].edit, g_commonFields[1].label, leaderDiff, error) ||
        !ReadDouble(g_commonFields[2].edit, g_commonFields[2].label, terrainPenalty, error)) {
        SetText(g_output, error);
        return;
    }

    if (dice < 0.0 || dice > 9.0) {
        SetText(g_output, L"骰子应在 0 到 9 之间。");
        return;
    }
    if (terrainPenalty < 0.0) {
        SetText(g_output, L"地形惩罚请输入正数点数。");
        return;
    }

    SideInput attacker = {};
    SideInput defender = {};
    if (!ReadSideInput(Side::Attacker, g_attacker, attacker, error) ||
        !ReadSideInput(Side::Defender, g_defender, defender, error)) {
        SetText(g_output, error);
        return;
    }

    const LRESULT phaseIndex = SendMessageW(g_phaseCombo, CB_GETCURSEL, 0, 0);
    if (phaseIndex == CB_ERR) {
        SetText(g_output, L"请选择阶段。");
        return;
    }
    const CombatPhase phase = static_cast<CombatPhase>(phaseIndex);
    const bool isBackrowArtillery = SendMessageW(g_backrowArtillery, BM_GETCHECK, 0, 0) == BST_CHECKED;

    const DamageBreakdown attackerToDefender = ComputeOneWayDamage(attacker, defender, phase, dice, leaderDiff, terrainPenalty, isBackrowArtillery);
    const DamageBreakdown defenderToAttacker = ComputeOneWayDamage(defender, attacker, phase, dice, -leaderDiff, 0.0, isBackrowArtillery);

    std::wostringstream output;
    output << std::fixed << std::setprecision(2);
    output << L"阶段：" << (phase == CombatPhase::Fire ? L"火力" : L"冲击") << L"\r\n";
    output << L"进攻方兵员损失：" << defenderToAttacker.finalDamage << L"\r\n";
    output << L"防守方兵员损失：" << attackerToDefender.finalDamage << L"\r\n\r\n";
    output << L"进攻方 -> 防守方\r\n";
    output << L"兵种组：" << TranslateGroupName(attacker.group) << L"；兵种：" << TranslateUnitName(attacker.unit->unitName) << L"\r\n";
    output << L"基础伤亡 = max(15, 15 + 5 x (" << dice << L" + " << leaderDiff << L" + "
           << attackerToDefender.attackerPips << L" - " << attackerToDefender.defenderPips
           << L" - " << terrainPenalty << L")) = " << attackerToDefender.baseCasualties << L"\r\n";
    output << L"科技修正 = " << attackerToDefender.techModifier << L"，守方战术 = " << attackerToDefender.defenderTactics << L"\r\n\r\n";
    output << L"防守方 -> 进攻方\r\n";
    output << L"兵种组：" << TranslateGroupName(defender.group) << L"；兵种：" << TranslateUnitName(defender.unit->unitName) << L"\r\n";
    output << L"基础伤亡 = max(15, 15 + 5 x (" << dice << L" + " << -leaderDiff << L" + "
           << defenderToAttacker.attackerPips << L" - " << defenderToAttacker.defenderPips
           << L" - 0)) = " << defenderToAttacker.baseCasualties << L"\r\n";
    output << L"科技修正 = " << defenderToAttacker.techModifier << L"，守方战术 = " << defenderToAttacker.defenderTactics << L"\r\n";

    SetText(g_output, output.str());
}

void CreateCommonControls(HWND window)
{
    g_commonFields = {
        {DiceId, L"骰子", L"5", L"0-9", 20, 72},
        {LeaderDiffId, L"将领差额", L"0", L"点", 230, 72},
        {TerrainPenaltyId, L"进攻地形惩罚", L"0", L"点", 440, 72}
    };

    for (auto& field : g_commonFields) {
        CreateChild(window, L"STATIC", field.label, 0, field.x, field.y + 4, 100, 24);
        field.edit = CreateChild(window,
                                 L"EDIT",
                                 field.initialValue,
                                 WS_TABSTOP | ES_AUTOHSCROLL | WS_BORDER,
                                 field.x + 100,
                                 field.y,
                                 70,
                                 25,
                                 field.id,
                                 WS_EX_CLIENTEDGE);
        CreateChild(window, L"STATIC", field.suffix, 0, field.x + 176, field.y + 4, 40, 24);
    }

    CreateChild(window, L"STATIC", L"阶段", 0, 640, 76, 40, 24);
    g_phaseCombo = CreateChild(window,
                               L"COMBOBOX",
                               L"",
                               CBS_DROPDOWNLIST | WS_TABSTOP | WS_VSCROLL,
                               682,
                               72,
                               120,
                               220,
                               kPhaseComboId);
    SendMessageW(g_phaseCombo, CB_ADDSTRING, 0, reinterpret_cast<LPARAM>(L"火力"));
    SendMessageW(g_phaseCombo, CB_ADDSTRING, 0, reinterpret_cast<LPARAM>(L"冲击"));
    SendMessageW(g_phaseCombo, CB_SETCURSEL, 0, 0);

    g_backrowArtillery = CreateChild(window,
                                     L"BUTTON",
                                     L"后排炮兵（炮兵伤害 x 50%）",
                                     BS_AUTOCHECKBOX | WS_TABSTOP,
                                     820,
                                     72,
                                     220,
                                     28,
                                     kBackrowArtilleryId);
}

void CreateSidePanel(HWND window, Side side, SideControls& controls)
{
    const int x = SideX(side);
    const int headerY = kPanelTop - 34;
    CreateChild(window, L"STATIC", SideLabel(side), 0, x, headerY, 160, 28);

    CreateChild(window, L"STATIC", L"兵种组", 0, x, kPanelTop, 60, 24);
    controls.groupCombo = CreateChild(window,
                                      L"COMBOBOX",
                                      L"",
                                      CBS_DROPDOWNLIST | WS_TABSTOP | WS_VSCROLL,
                                      x + 60,
                                      kPanelTop - 4,
                                      180,
                                      260,
                                      side == Side::Attacker ? 6001 : 7001);
    for (const auto& group : g_unitGroups) {
        const std::wstring displayGroup = TranslateGroupName(group);
        SendMessageW(controls.groupCombo, CB_ADDSTRING, 0, reinterpret_cast<LPARAM>(displayGroup.c_str()));
    }
    if (!g_unitGroups.empty()) {
        SendMessageW(controls.groupCombo, CB_SETCURSEL, 0, 0);
    }

    CreateChild(window, L"STATIC", L"兵种类型", 0, x + 250, kPanelTop, 70, 24);
    controls.unitTypeCombo = CreateChild(window,
                                         L"COMBOBOX",
                                         L"",
                                         CBS_DROPDOWNLIST | WS_TABSTOP | WS_VSCROLL,
                                         x + 320,
                                         kPanelTop - 4,
                                         150,
                                         220,
                                         side == Side::Attacker ? 6002 : 7002);
    SendMessageW(controls.unitTypeCombo, CB_ADDSTRING, 0, reinterpret_cast<LPARAM>(L"步兵"));
    SendMessageW(controls.unitTypeCombo, CB_ADDSTRING, 0, reinterpret_cast<LPARAM>(L"骑兵"));
    SendMessageW(controls.unitTypeCombo, CB_ADDSTRING, 0, reinterpret_cast<LPARAM>(L"炮兵"));
    SendMessageW(controls.unitTypeCombo, CB_SETCURSEL, 0, 0);

    CreateChild(window, L"STATIC", L"具体兵种", 0, x, kPanelTop + kRowHeight, 70, 24);
    controls.unitCombo = CreateChild(window,
                                     L"COMBOBOX",
                                     L"",
                                     CBS_DROPDOWNLIST | WS_TABSTOP | WS_VSCROLL,
                                     x + 70,
                                     kPanelTop + kRowHeight - 4,
                                     400,
                                     300,
                                     side == Side::Attacker ? 6003 : 7003);

    for (auto& field : controls.fields) {
        const int rowY = kPanelTop + (field.row + 2) * kRowHeight;
        CreateChild(window, L"STATIC", field.label, 0, x, rowY + 4, kLabelWidth, 24);
        field.edit = CreateChild(window,
                                 L"EDIT",
                                 field.initialValue,
                                 WS_TABSTOP | ES_AUTOHSCROLL | WS_BORDER,
                                 x + kLabelWidth,
                                 rowY,
                                 kEditWidth,
                                 25,
                                 side == Side::Attacker ? field.id + 10000 : field.id + 20000,
                                 WS_EX_CLIENTEDGE);
        CreateChild(window, L"STATIC", field.suffix, 0, x + kLabelWidth + kEditWidth + 8, rowY + 4, kSuffixWidth, 24);
    }
}

void CreateMainControls(HWND window)
{
    CreateChild(window, L"STATIC", L"EU4 陆战双向兵员伤害计算器", 0, kMargin, 18, 420, 28);
    CreateChild(window,
                L"STATIC",
                L"左边填写进攻方，右边填写防守方。兵种组和兵种互相独立，程序会同时算出双方损失。",
                0,
                kMargin,
                46,
                980,
                24);

    CreateCommonControls(window);
    InitializeSideFields(g_attacker);
    InitializeSideFields(g_defender);
    CreateSidePanel(window, Side::Attacker, g_attacker);
    CreateSidePanel(window, Side::Defender, g_defender);
    UpdateAllUnitCombos();

    CreateChild(window,
                L"BUTTON",
                L"计算双方损失",
                BS_DEFPUSHBUTTON | WS_TABSTOP,
                430,
                520,
                180,
                38,
                kCalculateButtonId);

    g_output = CreateChild(window,
                           L"EDIT",
                           L"",
                           ES_MULTILINE | ES_READONLY | ES_AUTOVSCROLL | WS_VSCROLL | WS_BORDER,
                           kMargin,
                           580,
                           1020,
                           260,
                           kOutputId,
                           WS_EX_CLIENTEDGE);

    CalculateDamage();
}

LRESULT CALLBACK WindowProc(HWND window, UINT message, WPARAM wParam, LPARAM lParam)
{
    switch (message) {
    case WM_CREATE:
        CreateMainControls(window);
        return 0;

    case WM_COMMAND:
        if (LOWORD(wParam) == kCalculateButtonId) {
            CalculateDamage();
            return 0;
        }
        if (HIWORD(wParam) == CBN_SELCHANGE &&
            (LOWORD(wParam) == 6001 || LOWORD(wParam) == 6002 || LOWORD(wParam) == 7001 || LOWORD(wParam) == 7002)) {
            UpdateAllUnitCombos();
            return 0;
        }
        break;

    case WM_DESTROY:
        PostQuitMessage(0);
        return 0;
    }

    return DefWindowProcW(window, message, wParam, lParam);
}

} // namespace

int RunApplication(HINSTANCE instance, int showCommand)
{
    SetProcessDPIAware();
    LoadUnitData();

    const wchar_t className[] = L"EU4LandDamageCalculatorWindow";
    WNDCLASSW windowClass = {};
    windowClass.lpfnWndProc = WindowProc;
    windowClass.hInstance = instance;
    windowClass.lpszClassName = className;
    windowClass.hCursor = LoadCursorW(nullptr, IDC_ARROW);
    windowClass.hbrBackground = reinterpret_cast<HBRUSH>(COLOR_WINDOW + 1);
    RegisterClassW(&windowClass);

    HWND window = CreateWindowExW(0,
                                  className,
                                  L"EU4 陆战双向兵员伤害计算器",
                                  WS_OVERLAPPED | WS_CAPTION | WS_SYSMENU | WS_MINIMIZEBOX,
                                  CW_USEDEFAULT,
                                  CW_USEDEFAULT,
                                  kWindowWidth,
                                  kWindowHeight,
                                  nullptr,
                                  nullptr,
                                  instance,
                                  nullptr);
    if (window == nullptr) {
        return 1;
    }

    ShowWindow(window, showCommand);
    UpdateWindow(window);

    MSG message = {};
    while (GetMessageW(&message, nullptr, 0, 0) > 0) {
        TranslateMessage(&message);
        DispatchMessageW(&message);
    }
    return static_cast<int>(message.wParam);
}

int WINAPI wWinMain(HINSTANCE instance, HINSTANCE, PWSTR, int showCommand)
{
    return RunApplication(instance, showCommand);
}

int main()
{
    return RunApplication(GetModuleHandleW(nullptr), SW_SHOWDEFAULT);
}
