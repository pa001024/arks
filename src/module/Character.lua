local p = {}

local getArgs = require('Module:Arguments').getArgs
local CharacterData = mw.loadData('Module:Character/data')
local SkillData = mw.loadData('Module:Skill/data')
local util = require('Module:Util')
-- local Tags = {"输出", "生存", "削弱", "群攻", "控场", "治疗", "支援", "防护", "快速复活", "位移", "爆发", "减速", "费用回复"}

-- 获取角色数据 <Character>
function p.getCharacter(charName)
  if charName == '干员页面' then
    charName = '阿米娅'
  end
  return CharacterData.Characters[charName]
end

-- 获取平面化的角色数据 <CharacterFlat>
function p.getCharacterFlat(charName)
  -- 将数组形式的数据转换为逗号分隔数据
  local raw = p.getCharacter(charName)
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
      description = lv.description or '', -- 描述
      rangeId = lv.rangeId or skill.rangeId -- 范围
    }
  end

  -- 技能升级
  local rankUp =
    table.concat(
    util.map(
      util.concat(skillCost, charSkill.masterCost),
      function(lv)
        local items =
          util.map(
          lv,
          function(item)
            if (item.count or 1) > 1 then
              return item.name .. '|' .. item.count
            end
            return item.name
          end
        )
        return table.concat(items, ',')
      end
    ),
    ';'
  )
  -- mw.log(rankUp) -- debug

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
    duration = pickParm('duration'),
    spCost = pickParm('spCost'),
    initSp = pickParm('initSp'),
    description = pickParm('description'),
    rangeId = pickParm('rangeId'),
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
  }
  if telent.upgrades then
    params.upgrades =
      util.join(
      util.map(
        telent.upgrades,
        function(up)
          local params2 = {
            name = up.name,
            elite = up.phase,
            potential = up.potential,
            level = up.level,
            description = up.desc
          }
          return mw.getCurrentFrame():expandTemplate {title = '天赋升级', args = params2}
        end
      ),
      ''
    )
  end
  return mw.getCurrentFrame():expandTemplate {title = '天赋', args = params}
end

function p.expendBase(base)
  -- 后勤
  local params = {
    name = base.name, -- 名称
    cond = base.cond, -- 解锁条件
    at = base.at, -- 设施
    desc = base.desc, -- 描述
    evolve = base.evolve, -- 升级后名称
    evolveCond = base.evolveCond, -- 升级条件
    evolveDesc = base.evolveDesc -- 升级后描述
  }
  return mw.getCurrentFrame():expandTemplate {title = '后勤', args = params}
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
  if char.baseSkill then
    uParms['后勤'] = ''
    for _, base in pairs(char.baseSkill) do
      uParms['后勤'] = uParms['后勤'] .. p.expendBase(base)
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

function p.show(frame)
  local args = getArgs(frame)
  local charname = args['name'] or args[1] or mw.title.getCurrentTitle().text
  local keyname = args['key'] or args[2] or 'name'
  local char = p.getCharacterFlat(charname)

  return char[keyname]
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
  local name = args['name'] or args[1] or mw.title.getCurrentTitle().text
  local tab = p.getCharacter(name)
  return mw.getCurrentFrame():expandTemplate {title = 'Char/template', args = tab}
end

function p.json()
  return mw.text.jsonEncode(CharacterData.Characters)
end

-- 输出制定职业的列表
function p.nav(frame)
  local args = getArgs(frame)
  local pro = args[1]
  return p.renderNav(pro)
end

function p.renderNav(pro)
  local color = {'90A4AE', 'CDDC39', '03A9F4', 'BA68C8', 'FFEB3B', 'FF9800'}
  local spliter = ' <i class="fa fa-connectdevelop" display:inline-block;width:1em;text-align:center;"></i> '
  -- 筛选
  local chars =
    util.toArray(
    util.filter(
      CharacterData.Characters,
      function(char)
        return char.profession == pro
      end
    )
  )
  -- 排序
  util.sortBy(chars, util.byKey('rarity', 'desc'), util.byKey('name'))
  -- 组合
  local elems =
    util.map(
    chars,
    function(char)
      return '[[' ..
        char.name ..
          '|<span style="text-shadow: 1px 1px 1px black; color:#' ..
            color[char.rarity + 1] .. "\">'''" .. char.name .. "'''</span>]]"
    end
  )
  return util.join(elems, spliter)
end

return p
