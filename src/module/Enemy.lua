local p = {}

local getArgs = require('Module:Arguments').getArgs
local EnemyData = mw.loadData('Module:Enemy/data')
local util = require('Module:Util')

function p.getEnemy(name)
  return EnemyData.Enemies[name]
end

function p.getEnemyFlat(name)
  local raw = p.getEnemy(name)
  local dst = {}
  dst['名称'] = raw.name
  dst['种族'] = raw.enemyRace or '其它'
  dst['级别'] = raw.level
  dst['编号'] = raw.index
  dst['id'] = raw.id
  dst['简介'] = raw.description
  dst['攻击类型'] = raw.attackType
  dst['能力'] = raw.ability or ''
  dst['生命0'] = raw.maxHp0 or 0
  dst['攻击0'] = raw.atk0 or 0
  dst['防御0'] = raw.def0 or 0
  dst['法术抗性0'] = raw.magicResistance0 or 0
  dst['攻击速度0'] = raw.baseAttackTime0 or 0
  dst['移动速度0'] = raw.moveSpeed0 or 0
  dst['重量等级0'] = raw.massLevel0 or 0
  dst['攻击距离0'] = raw.rangeRadius0 or 0
  dst['生命1'] = raw.maxHp1 or raw.maxHp0 or 0
  dst['攻击1'] = raw.atk1 or raw.atk0 or 0
  dst['防御1'] = raw.def1 or raw.def0 or 0
  dst['法术抗性1'] = raw.magicResistance1 or raw.magicResistance0 or 0
  dst['攻击速度1'] = raw.baseAttackTime1 or raw.baseAttackTime0 or 0
  dst['移动速度1'] = raw.moveSpeed1 or raw.moveSpeed0 or 0
  dst['重量等级1'] = raw.massLevel1 or raw.massLevel0 or 0
  dst['攻击距离1'] = raw.rangeRadius1 or raw.rangeRadius0 or 0
  dst['level1'] =
    raw.maxHp1 or raw.atk1 or raw.def1 or raw.magicResistance1 or raw.baseAttackTime1 or raw.moveSpeed1 or
    raw.massLevel1 or
    raw.rangeRadiu1 or
    ''
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
  for _, enemy in pairs(EnemyData.Enemies) do
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