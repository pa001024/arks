local p = {}

local getArgs = require('Module:Arguments').getArgs
local CharacterData = mw.loadData('Module:Character/data')
local SkillData = mw.loadData('Module:Skill/data')
local util = require('Module:Util')
-- local Tags = {"输出", "生存", "削弱", "群攻", "控场", "治疗", "支援", "防护", "快速复活", "位移", "爆发", "减速", "费用回复"}

-- 获取角色数据 <Character>
function p.getCharacter(charName)
  return CharacterData.Characters[charName]
end

-- 获取平面化的角色数据 <CharacterFlat>
function p.getCharacterFlat(charName)
  -- 将数组形式的数据转换为逗号分隔数据
  local raw = CharacterData['Characters'][charName]
  local dst = {}
  dst.displayLogo = raw.displayLogo
  dst.potentialItemId = raw.potentialItemId
  dst.id = raw.id
  dst.name = raw.name
  dst.appellation = raw.appellation
  dst.appearance = raw.appearance
  dst.rarity = raw.rarity
  dst.profession = raw.profession
  dst.tagList = util.join(raw.tagList)
  dst.position = raw.position
  dst.itemObtainApproach = raw.itemObtainApproach
  dst.displayNumber = raw.displayNumber
  dst.description = raw.description
  dst.maxHp = util.join(raw.maxHp)
  dst.atk = util.join(raw.atk)
  dst.def = util.join(raw.def)
  dst.magicResistance = util.join(raw.magicResistance)
  dst.respawnTime = util.join(raw.respawnTime)
  dst.cost = util.join(raw.cost)
  dst.blockCnt = util.join(raw.blockCnt)
  dst.baseAttackTime = util.join(raw.baseAttackTime)
  dst.rangeId = util.join(raw.rangeId)
  dst.cv = raw.cv
  dst.art = raw.art
  return dst
end

function p.expendSkill(skill, charSkill, skillCost)
  -- 技能
  local levels = {}

  -- 各等级补全
  for i, lv in ipairs(skill.levels) do
    levels[i] = {
      duration = lv.duration or 0, -- 持续时间
      spCost = lv.spCost or 0, -- SP需求
      initSp = lv.initSp or 0, -- 初始SP
      description = lv.description or '' -- 描述
    }
  end

  -- 技能升级
  local rankUp =
    table.concat(
    util.map(
      util.concat(skillCost, charSkill.masterCost),
      function(lv)
        if (lv.count or 1) > 1 then
          return lv.count .. ';' .. lv.name
        end
        return lv.name
      end
    ),
    '{{!}}'
  )

  -- 转换成参数
  local function pickParm(parm)
    local list = util.pick(levels, parm)
    local has = util.some(list, util.Boolean)
    if has then
      return util.join(list)
    end
    return ''
  end

  local params = {
    name = skill.name,
    icon = skill.name,
    elite = charSkill.phase,
    skillType = skill.skillType, -- 触发方式 0=被动 1=主动 2=自动
    spType = skill.spType, -- 回复方式 1=自动 2=攻击 4=受击 8=被动
    rangeId = skill.rangeId,
    duration = pickParm('duration'),
    spCost = pickParm('spCost'),
    initSp = pickParm('initSp'),
    description = pickParm('description'),
    rankUp = rankUp
  }

  return mw.getCurrentFrame():expandTemplate {title = '技能条', args = params}
end

function p.expendTelent(telent)
  -- 天赋
  local params = {
    name = telent.name,
    elite = telent.phase,
    level = telent.level,
    description = telent.desc
    -- TODO: upgrades
  }
  return mw.getCurrentFrame():expandTemplate {title = '天赋', args = params}
end

function p.expendPotential(potential, name)
  -- 潜能
  local params = util.deepClone(potential)
  params.name = name
  return mw.getCurrentFrame():expandTemplate {title = '潜能', args = params}
end

function p.expendSkillGroup(name)
  local uParms = {}
  -- 开始生成
  local char = CharacterData.Characters[name]
  if char.skills then
    uParms['技能'] = ''
    for _, skill in pairs(char.skills) do
      local skillData = SkillData.Skills[skill.name]
      uParms['技能'] = uParms['技能'] .. p.expendSkill(skillData, skill, char.skillCost)
    end
  end
  if char.talents then
    uParms['天赋'] = ''
    for _, talent in pairs(char.talents) do
      uParms['天赋'] = uParms['天赋'] .. p.expendTelent(talent)
    end
  end
  if char.potentialRanks then
    uParms['潜能'] = p.expendPotential(char.potentialRanks, name)
  end
  return mw.getCurrentFrame():expandTemplate {title = '技能天赋', args = uParms}
end

-- 渲染
function p.renderSkillGroup(frame)
  local args = getArgs(frame)
  local pagename = args['name'] or args[1] or mw.title.getCurrentTitle().text
  local name = string.gsub(pagename, '/技能天赋$', '')

  return p.expendSkillGroup(name)
end

function p.infobox(frame)
  local args = getArgs(frame)
  local name = args['name'] or args[1] or mw.title.getCurrentTitle().text
  local char = p.getCharacterFlat(name)
  return mw.getCurrentFrame():expandTemplate {title = 'InfoboxChar/template', args = char}
end

function p.link(frame)
  local args = getArgs(frame)
  local name = args['name'] or args[1]
  local tab = p.getCharacter(name)
  local result = {}
  result['rarity'] = tab['rarity']
  result['name'] = tab['name']
  result['profession'] = tab['profession']
  return mw.getCurrentFrame():expandTemplate {title = 'LinkChar/template', args = result}
end

function p.char(frame)
  local args = getArgs(frame)
  local name = args['name'] or args[1]
  local tab = getItem(name)
  return mw.getCurrentFrame():expandTemplate {title = 'Char/template', args = tab}
end

return p
