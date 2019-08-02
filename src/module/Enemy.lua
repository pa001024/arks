local p = {}

local getArgs = require('Module:Arguments').getArgs
local EnemyData = mw.loadData('Module:Enemy/data')
local util = require('Module:Util')

function p.getEnemy(name)
  return EnemyData.Enemies[name]
end

function p.getEnemyFlat(name)
  if name == '持盾刀兵' then
    name = '机动盾兵'
  end
  local raw = p.getEnemy(name)
  local dst = {}
  dst['名称'] = name
  if not raw then
    return dst
  end
  dst['种族'] = raw.enemyRace or '其它'
  dst['级别'] = raw.level
  dst['编号'] = raw.index
  dst['id'] = raw.id
  dst['简介'] = raw.description
  dst['攻击类型'] = raw.attackType
  dst['能力'] = raw.ability or ''
  dst['出现关卡'] = raw.refers and util.join(raw.refers) or ''
  if raw.levels then
    if raw.levels[1] then
      dst['生命0'] = raw.levels[1].maxHp or 0
      dst['攻击0'] = raw.levels[1].atk or 0
      dst['防御0'] = raw.levels[1].def or 0
      dst['法术抗性0'] = raw.levels[1].magicResistance or 0
      dst['攻击速度0'] = raw.levels[1].baseAttackTime or 0
      dst['移动速度0'] = raw.levels[1].moveSpeed or 0
      dst['重量等级0'] = raw.levels[1].massLevel or 0
      dst['攻击距离0'] = raw.levels[1].rangeRadius or 0
    end
    if raw.levels[2] then
      dst['生命1'] = raw.levels[2].maxHp or raw.levels[1].maxHp or 0
      dst['攻击1'] = raw.levels[2].atk or raw.levels[1].atk or 0
      dst['防御1'] = raw.levels[2].def or raw.levels[1].def or 0
      dst['法术抗性1'] = raw.levels[2].magicResistance or raw.levels[1].magicResistance or 0
      dst['攻击速度1'] = raw.levels[2].baseAttackTime or raw.levels[1].baseAttackTime or 0
      dst['移动速度1'] = raw.levels[2].moveSpeed or raw.levels[1].moveSpeed or 0
      dst['重量等级1'] = raw.levels[2].massLevel or raw.levels[1].massLevel or 0
      dst['攻击距离1'] = raw.levels[2].rangeRadius or raw.levels[1].rangeRadius or 0
      dst['level1'] = 1
    end
  end

  -- 数组
  dst['属性'] = util.join(raw.handbook)
  return dst
end

function p.renderEnemy(name)
  local tab = p.getEnemyFlat(name)
  return mw.getCurrentFrame():expandTemplate {title = 'Enemy/template', args = tab}
end

function p.renderListEnemy(type)
  local rst = ''
  for _, enemyIndex in ipairs(EnemyData.EnemiesIndex) do
    local enemy = p.getEnemy(enemyIndex)
    if not type or type == enemy.level then
      rst = rst .. p.renderEnemy(enemy.name)
    end
  end
  return rst
end

function p.listEnemy(frame)
  local args = getArgs(frame)
  local type = args['type'] or args[1] or mw.title.getCurrentTitle().text
  local tab = p.renderListEnemy(type)
  return tab
end

function p.infobox(frame)
  local args = getArgs(frame)
  local name = args['name'] or args[1] or mw.title.getCurrentTitle().text
  local tab = p.getEnemyFlat(name)
  return mw.getCurrentFrame():expandTemplate {title = 'InfoboxEnemy/template', args = tab}
end

function p.enemy(frame)
  local args = getArgs(frame)
  local name = args['name'] or args[1] or mw.title.getCurrentTitle().text
  local tab = p.getEnemyFlat(name)
  return mw.getCurrentFrame():expandTemplate {title = 'Enemy/template', args = tab}
end

function p.link(frame)
  local args = getArgs(frame)
  local name = args['name'] or args[1] or mw.title.getCurrentTitle().text
  local tab = p.getEnemyFlat(name)
  return mw.getCurrentFrame():expandTemplate {title = 'LinkEnemy/template', args = tab}
end

function p.tt(frame)
  local args = getArgs(frame)
  local name = args['name'] or args[1] or mw.title.getCurrentTitle().text
  local tab = p.getEnemyFlat(name)
  return mw.getCurrentFrame():expandTemplate {title = 'tt/enemy/template', args = tab}
end

return p
