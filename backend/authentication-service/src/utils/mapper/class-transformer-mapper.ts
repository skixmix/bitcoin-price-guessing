import { ClassConstructor, ClassTransformOptions, plainToInstance } from 'class-transformer';

export class ClassTransformerMapper {
    private static readonly _OPTIONS: ClassTransformOptions = {
        excludeExtraneousValues: true,
        exposeDefaultValues: true,
    };

    public static map<DestinationClass, SourceObject>(
        destinationClass: ClassConstructor<DestinationClass>,
        sourceObject: SourceObject,
    ): DestinationClass {
        return plainToInstance<DestinationClass, SourceObject>(destinationClass, sourceObject, this._OPTIONS);
    }
}
