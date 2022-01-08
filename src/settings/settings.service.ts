import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UpdateSettingDto } from "./dto/update-setting.dto";
import { Setting } from "./entities/setting.entity";

@Injectable()
export class SettingsService {
  constructor(
    @InjectRepository(Setting)
    private settingRepository: Repository<Setting>
  ) {}
  findAll(): Promise<Setting[]> {
    return this.settingRepository.find();
  }

  saveSetting(setting: Setting) {
    return this.settingRepository.save(setting);
  }

  findOne(id: number) {
    return `This action returns a #${id} setting`;
  }

  update(id: number, _updateSettingDto: UpdateSettingDto) {
    return `This action updates a #${id} setting`;
  }
}
