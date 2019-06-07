local p = {}

local getArgs = require('Module:Arguments').getArgs
local CharacterData = mw.loadData("Module:Character/data")
local util = require( "Module:Util" )
-- local Tags = {"输出", "生存", "削弱", "群攻", "控场", "治疗", "支援", "防护", "快速复活", "位移", "爆发", "减速", "费用回复"}

-- 获取角色数据 <Character>
function p.getCharacter(charName)
    return CharacterData["Characters"][charName]
end

-- 获取平面化的角色数据 <CharacterFlat>
function p.getCharacterFlat(charName)
    -- 将数组形式的数据转换为逗号分隔数据
    local function join(list)
        local val = util.deepClone(list)
        return table.concat(val, ",")
    end
    local raw = CharacterData["Characters"][charName]
    local dst = {}
    -- displayLogo=logo_rhodes
    -- potentialItemId=p_char_002_amiya
    -- name=阿米娅
    -- appellation=Amiya
    -- rarity=4
    -- profession=CASTER
    -- tagList=输出
    -- position=远程位
    -- itemObtainApproach=主线剧情
    -- displayNumber=R001
    -- description=攻击造成法术伤害
    -- maxHp=699,958,1198,1480
    -- atk=276,390,514,612
    -- def=48,81,100,121
    -- magicResistance=10,15,20
    -- respawnTime=70
    -- cost=18
    -- blockCnt=1
    -- baseAttackTime=1.6
    -- talent=情绪吸收
    -- skill=战术咏唱·γ型,精神爆发,奇美拉
    -- supportskill=合作协议,小提琴演奏
    -- atkrange=02220,01220,02220
    -- cv=黑泽朋世
    -- art=唯@W
    dst.displayLogo = raw.displayLogo
    dst.potentialItemId = raw.potentialItemId
    dst.name = raw.name
    dst.appellation = raw.appellation
    dst.rarity = raw.rarity
    dst.profession = raw.profession
    dst.tagList = join(raw.tagList)
    dst.position = raw.position
    dst.itemObtainApproach = raw.itemObtainApproach
    dst.displayNumber = raw.displayNumber
    dst.description = raw.description
    dst.maxHp = join(raw.maxHp)
    dst.atk = join(raw.atk)
    dst.def = join(raw.def)
    dst.magicResistance = join(raw.magicResistance)
    dst.respawnTime = join(raw.respawnTime)
    dst.cost = join(raw.cost)
    dst.blockCnt = join(raw.blockCnt)
    dst.baseAttackTime = join(raw.baseAttackTime)
    dst.talent = raw.talent
    dst.skill = raw.skill
    -- dst.supportskill = raw.supportskill 没找到
    dst.rangeId = join(raw.rangeId)
    dst.cv = raw.cv
    dst.art = raw.art
    return dst
end

function p.infobox(frame)
	local args = getArgs(frame)
	local name = args['name'] or args[1] or mw.title.getCurrentTitle().text
	local char = p.getCharacterFlat(name)
	return mw.getCurrentFrame():expandTemplate{ title = 'InfoboxChar/template', args = char }
end

function p.link(frame)
	local args = getArgs(frame)
	local name = args['name'] or args[1]
	local tab = p.getCharacter(name)
	local result = {}
	result['rarity'] = tab['rarity']
	result['name'] = tab['name']
	result['profession'] = tab['profession']
	return mw.getCurrentFrame():expandTemplate{ title = 'LinkChar/template', args = result }
end

function p.char(frame)
	local args = getArgs(frame)
	local name = args['name'] or args[1]
	local tab = getItem(name)
	return mw.getCurrentFrame():expandTemplate{ title = 'Char/template', args = tab }
end

function p.jsonInfobox(frame)
	local args = getArgs(frame)
	local name = args['name'] or args[1] or mw.title.getCurrentTitle().text

	local query = {
			['_id'] = 'Data:Character_table.json',
	}
	local result = mw.huiji.db.find(query)
	local full = result[1]
	local temp = ''
	local raw = nil
	for i, data in pairs(full) do
		if data.name == name then
			raw = data
		end
	end
	tab = p.correspond(raw)
	return mw.getCurrentFrame():expandTemplate{ title = 'InfoboxChar/template', args = tab }
end

function p.correspond(raw)
	-- 这块需要看模板进行对应
	return {
	['art'] = raw['drawName'],
	['cv'] = raw['infoName'],
	['name'] = raw['name'],
	['rangeId'] = raw['rangeId'],
	['description'] = raw['description'],
	['canUseGeneralPotentialItem'] = raw['canUseGeneralPotentialItem'],
	['potentialItemId'] = raw['potentialItemId'],
	['team'] = raw['team'],
	['displayNumber'] = raw['displayNumber'],
	['tokenKey'] = raw['tokenKey'],
	['appellation'] = raw['appellation'],
	['position'] = raw['position'],
	['tagList001'] = raw['tagList'][1] or '',
	["tagList002"] = raw['tagList'][2] or '',
	["tagList003"] = raw['tagList'][3] or '',
	['displayLogo'] = raw['displayLogo'],
	['itemUsage'] = raw['itemUsage'],
	['itemDesc'] = raw['itemDesc'],
	['itemObtainApproach'] = raw['itemObtainApproach'],
	['maxPotentialLevel'] = raw['maxPotentialLevel'],
	['rarity'] = raw['rarity'],
	['profession'] = raw['profession'],
	['traitcandidatesunlockConditionphase'] = raw['traitcandidatesunlockConditionphase'] or '',
	['traitcandidatesunlockConditionlevel'] = raw['traitcandidatesunlockConditionlevel'] or '',
	['traitcandidatesrequiredPotentialRank'] = raw['traitcandidatesrequiredPotentialRank'] or '',
	['traitcandidatesblackboardkey'] = raw['traitcandidatesblackboardkey'] or '',
	['traitcandidatesblackboardvalue'] = raw['traitcandidatesblackboardvalue'] or '',
	['trait'] = raw['trait'] or '',
	['phasescharacterPrefabKey'] = raw['phasescharacterPrefabKey'] or '',
	['phasesrangeId'] = raw['phasesrangeId'] or '',
	['phasesmaxLevel'] = raw['phasesmaxLevel'] or '',
	['phasesattributesKeyFrameslevel'] = raw['phasesattributesKeyFrameslevel'] or '',
	['maxHp'] = raw['maxHp'] or '',
	['atk'] = raw['phasesattributesKeyFramesdataatk'] or '',
	['def'] = raw['phasesattributesKeyFramesdatadef'] or '',
	['magicResistance'] = raw['phasesattributesKeyFramesdatamagicResistance'] or '',
	['cost'] = raw['phasesattributesKeyFramesdatacost'] or '',
	['blockCnt'] = raw['phasesattributesKeyFramesdatablockCnt'] or '',
	['phasesattributesKeyFramesdatamoveSpeed'] = raw['phasesattributesKeyFramesdatamoveSpeed'] or '',
	['phasesattributesKeyFramesdataattackSpeed'] = raw['phasesattributesKeyFramesdataattackSpeed'] or '',
	['baseAttackTime'] = raw['phasesattributesKeyFramesdatabaseAttackTime'] or '',
	['spawnTime'] = raw['phasesattributesKeyFramesdatarespawnTime'] or '',
	['phasesattributesKeyFramesdatahpRecoveryPerSec'] = raw['phasesattributesKeyFramesdatahpRecoveryPerSec'] or '',
	['phasesattributesKeyFramesdataspRecoveryPerSec'] = raw['phasesattributesKeyFramesdataspRecoveryPerSec'] or '',
	['phasesattributesKeyFramesdatamaxDeployCount'] = raw['phasesattributesKeyFramesdatamaxDeployCount'] or '',
	['phasesattributesKeyFramesdatamaxDeckStackCnt'] = raw['phasesattributesKeyFramesdatamaxDeckStackCnt'] or '',
	['phasesattributesKeyFramesdatatauntLevel'] = raw['phasesattributesKeyFramesdatatauntLevel'] or '',
	['phasesattributesKeyFramesdatamassLevel'] = raw['phasesattributesKeyFramesdatamassLevel'] or '',
	['phasesattributesKeyFramesdatabaseForceLevel'] = raw['phasesattributesKeyFramesdatabaseForceLevel'] or '',
	['phasesattributesKeyFramesdatastunImmune'] = raw['phasesattributesKeyFramesdatastunImmune'] or '',
	['phasesattributesKeyFramesdatasilenceImmune'] = raw['phasesattributesKeyFramesdatasilenceImmune'] or '',
	['phasesevolveCostid'] = raw['phasesevolveCostid'] or '',
	['phasesevolveCostcount'] = raw['phasesevolveCostcount'] or '',
	['phasesevolveCosttype'] = raw['phasesevolveCosttype'] or '',
	['phasesevolveCost'] = raw['phasesevolveCost'] or '',
	['skillsskillId'] = raw['skillsskillId'] or '',
	['skillslevelUpCostCondunlockCondphase'] = raw['skillslevelUpCostCondunlockCondphase'] or '',
	['skillslevelUpCostCondunlockCondlevel'] = raw['skillslevelUpCostCondunlockCondlevel'] or '',
	['skillslevelUpCostCondlvlUpTime'] = raw['skillslevelUpCostCondlvlUpTime'] or '',
	['skillslevelUpCostCondlevelUpCostid'] = raw['skillslevelUpCostCondlevelUpCostid'] or '',
	['skillslevelUpCostCondlevelUpCostcount'] = raw['skillslevelUpCostCondlevelUpCostcount'] or '',
	['skillslevelUpCostCondlevelUpCosttype'] = raw['skillslevelUpCostCondlevelUpCosttype'] or '',
	['skillsunlockCondphase'] = raw['skillsunlockCondphase'] or '',
	['skillsunlockCondlevel'] = raw['skillsunlockCondlevel'] or '',
	['talentscandidatesunlockConditionphase'] = raw['talentscandidatesunlockConditionphase'] or '',
	['talentscandidatesunlockConditionlevel'] = raw['talentscandidatesunlockConditionlevel'] or '',
	['talentscandidatesrequiredPotentialRank'] = raw['talentscandidatesrequiredPotentialRank'] or '',
	['talentscandidatesprefabKey'] = raw['talentscandidatesprefabKey'] or '',
	['talentscandidatesname'] = raw['talentscandidatesname'] or '',
	['talentscandidatesdescription'] = raw['talentscandidatesdescription'] or '',
	['talentscandidatesrangeId'] = raw['talentscandidatesrangeId'] or '',
	['talentscandidatesblackboardkey'] = raw['talentscandidatesblackboardkey'] or '',
	['talentscandidatesblackboardvalue'] = raw['talentscandidatesblackboardvalue'] or '',
	['potentialRankstype'] = raw['potentialRankstype'] or '',
	['potentialRanksdescription'] = raw['potentialRanksdescription'] or '',
	['potentialRanksbuffattributesabnormalFlags'] = raw['potentialRanksbuffattributesabnormalFlags'] or '',
	['potentialRanksbuffattributesattributeModifiersattributeType'] = raw['potentialRanksbuffattributesattributeModifiersattributeType'] or '',
	['potentialRanksbuffattributesattributeModifiersformulaItem'] = raw['potentialRanksbuffattributesattributeModifiersformulaItem'] or '',
	['potentialRanksbuffattributesattributeModifiersvalue'] = raw['potentialRanksbuffattributesattributeModifiersvalue'] or '',
	['potentialRanksbuffattributesattributeModifiersloadFromBlackboard'] = raw['potentialRanksbuffattributesattributeModifiersloadFromBlackboard'] or '',
	['potentialRanksbuffattributesattributeModifiersfetchBaseValueFromSourceEntity'] = raw['potentialRanksbuffattributesattributeModifiersfetchBaseValueFromSourceEntity'] or '',
	['potentialRanksbuff'] = raw['potentialRanksbuff'] or '',
	['potentialRanksequivalentCost'] = raw['potentialRanksequivalentCost'] or '',
	['favorKeyFrameslevel'] = raw['favorKeyFrameslevel'] or '',
	['favorKeyFramesdatamaxHp'] = raw['favorKeyFramesdatamaxHp'] or '',
	['favorKeyFramesdataatk'] = raw['favorKeyFramesdataatk'] or '',
	['favorKeyFramesdatadef'] = raw['favorKeyFramesdatadef'] or '',
	['favorKeyFramesdatamagicResistance'] = raw['favorKeyFramesdatamagicResistance'] or '',
	['favorKeyFramesdatacost'] = raw['favorKeyFramesdatacost'] or '',
	['favorKeyFramesdatablockCnt'] = raw['favorKeyFramesdatablockCnt'] or '',
	['favorKeyFramesdatamoveSpeed'] = raw['favorKeyFramesdatamoveSpeed'] or '',
	['favorKeyFramesdataattackSpeed'] = raw['favorKeyFramesdataattackSpeed'] or '',
	['favorKeyFramesdatabaseAttackTime'] = raw['favorKeyFramesdatabaseAttackTime'] or '',
	['favorKeyFramesdatarespawnTime'] = raw['favorKeyFramesdatarespawnTime'] or '',
	['favorKeyFramesdatahpRecoveryPerSec'] = raw['favorKeyFramesdatahpRecoveryPerSec'] or '',
	['favorKeyFramesdataspRecoveryPerSec'] = raw['favorKeyFramesdataspRecoveryPerSec'] or '',
	['favorKeyFramesdatamaxDeployCount'] = raw['favorKeyFramesdatamaxDeployCount'] or '',
	['favorKeyFramesdatamaxDeckStackCnt'] = raw['favorKeyFramesdatamaxDeckStackCnt'] or '',
	['favorKeyFramesdatatauntLevel'] = raw['favorKeyFramesdatatauntLevel'] or '',
	['favorKeyFramesdatamassLevel'] = raw['favorKeyFramesdatamassLevel'] or '',
	['favorKeyFramesdatabaseForceLevel'] = raw['favorKeyFramesdatabaseForceLevel'] or '',
	['favorKeyFramesdatastunImmune'] = raw['favorKeyFramesdatastunImmune'] or '',
	['favorKeyFramesdatasilenceImmune'] = raw['favorKeyFramesdatasilenceImmune'] or '',
	['allSkillLvlupunlockCondphase'] = raw['allSkillLvlupunlockCondphase'] or '',
	['allSkillLvlupunlockCondlevel'] = raw['allSkillLvlupunlockCondlevel'] or '',
	['allSkillLvluplvlUpCostid'] = raw['allSkillLvluplvlUpCostid'] or '',
	['allSkillLvluplvlUpCostcount'] = raw['allSkillLvluplvlUpCostcount'] or '',
	['allSkillLvluplvlUpCosttype'] = raw['allSkillLvluplvlUpCosttype'] or '',
	}
end
return p
