local p = {}

local getArgs = require('Module:Arguments').getArgs
local SkillData = mw.loadData('Module:Skill/data')
local util = require('Module:Util')

function p.getSkill(name)
  return SkillData.Skills[name]
end

function p.getSkillFlat(name)
  local raw = p.getSkill(name)
  local dst = {}
  dst.name = raw.name
  dst.skillType = raw.skillType
  dst.spType = raw.spType
  dst.rangeId = raw.rangeId
  -- 数组
  dst.usedBy = raw.usedBy and util.join(raw.usedBy)
  -- dst.levels = raw.levels and util.join(raw.levels)
  return dst
end

function p.infobox(frame)
  local args = getArgs(frame)
  local name = args['name'] or args[1] or mw.title.getCurrentTitle().text
  local tab = p.getSkillFlat(name)
  return mw.getCurrentFrame():expandTemplate {title = 'InfoboxSkill/template', args = tab}
end

function p.tt(frame)
  local args = getArgs(frame)
  local name = args['name'] or args[1]
  local tab = p.getSkillFlat(name)
  return mw.getCurrentFrame():expandTemplate {title = 'tt/Skill/template', args = tab}
end

function p.link(frame)
  local args = getArgs(frame)
  local name = args['name'] or args[1]
  local tab = p.getSkillFlat(name)
  return mw.getCurrentFrame():expandTemplate {title = 'LinkSkill/template', args = tab}
end

function p.expendSkill(skill)
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
    skillType = skill.skillType, -- 触发方式 0=被动 1=主动 2=自动
    spType = skill.spType, -- 回复方式 1=自动 2=攻击 4=受击 8=被动
    rangeId = skill.rangeId,
    duration = pickParm('duration'),
    spCost = pickParm('spCost'),
    initSp = pickParm('initSp'),
    description = pickParm('description')
  }

  return mw.getCurrentFrame():expandTemplate {title = '技能条', args = params}
end

function p.renderSkill(frame)
  local args = getArgs(frame)
  local name = args['name'] or args[1] or mw.title.getCurrentTitle().text
  local data = p.getSkill(name)
  local usedBy = data.usedBy and util.join(data.usedBy)
  return mw.getCurrentFrame():expandTemplate {title = 'SkillUsedBy', args = {usedBy}} .. p.expendSkill(data)
end

return p