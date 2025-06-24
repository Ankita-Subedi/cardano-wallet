import dotenv from "dotenv";
import { Expose, plainToInstance } from "class-transformer";
import { IsNotEmpty, IsString, validateSync } from "class-validator";

dotenv.config();

class EnvSchema {
  @Expose()
  @IsString()
  @IsNotEmpty()
  MNEMONIC!: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  BLOCKFROST_API_KEY!: string;
}

export let config: EnvSchema;

function validateEnv() {
  config = plainToInstance(EnvSchema, process.env, {
    excludeExtraneousValues: true,
  });

  const errors = validateSync(config, { whitelist: true });

  if (errors.length > 0) {
    throw new Error(
      " Invalid environment variables:\n" + JSON.stringify(errors, null, 2)
    );
  }
}

validateEnv();
