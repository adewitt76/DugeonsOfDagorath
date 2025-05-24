/*
 *
 *  Creature Definition Macro
 *
 *  Arguments:
 *       0) Vector List (the name of the drawing)
 *       1) Movement Delay Time
 *       2) Attack Delay Time
 *       3) Magic Offense
 *       4) Magic Defense
 *       5) Physical Offense
 *       6) Physical Defense
 *       7) Hit Points
 *
 *       SPIDER,23,11,0,255,128,255,32
 *       VIPER,15,7,0,255,80,128,56
 *       SGINT1,29,23,0,255,52,192,200
 *       BLOB,31,31,0,255,96,167,304
 *       KNIGT1,13,7,0,128,96,60,504
 *       SGINT2,17,13,0,128,128,48,704
 *       SCORP,5,4,255,128,255,128,400
 *       KNIGT2,13,7,0,64,255,8,800
 *       WRAITH,3,3,192,16,192,8,800
 *       BALROG,4,3,255,5,255,3,1000
 *       WIZ0,13,7,255,6,255,0,1000
 *       WIZ1,13,7,255,6,255,0,8000
 */
export class Creature {

  _move_delay_time;
  _attack_delay_time;
  _magic_offense;
  _magic_defense;
  _physical_offense;
  _physical_defense;
  _hit_points;

  constructor(
    move_delay_time,
    attack_delay_time,
    magic_offense,
    magic_defense,
    physical_offense,
    physical_defense,
    hit_points
  ) {
    this._move_delay_time = move_delay_time;
    this._attack_delay_time = attack_delay_time;
    this._magic_offense = magic_offense;
    this._magic_defense = magic_defense;
    this._physical_offense = physical_offense;
    this._physical_defense = physical_defense;
    this._hit_points = hit_points;
  }

}
